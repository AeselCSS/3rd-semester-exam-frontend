import React, {useState, useEffect} from 'react';
import useParticipant from '../hooks/useParticipant';
import useDiscipline from '../hooks/useDiscipline';
import {ParticipantRequestDTO, DisciplineResponseDTO, ParticipantResponseDTO} from '../shared.types';
import {Gender} from '../enums';

interface ParticipantFormProps {
    onClose: () => void;
    existingParticipant?: ParticipantRequestDTO | ParticipantResponseDTO;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({onClose, existingParticipant}) => {
    const {useCreateParticipantMutation, useUpdateParticipantMutation} = useParticipant();
    const createMutation = useCreateParticipantMutation();
    const updateMutation = useUpdateParticipantMutation();

    const {useDisciplinesQuery} = useDiscipline();
    const {data: disciplines, isLoading: isDisciplinesLoading, error: disciplinesError} = useDisciplinesQuery();

    const [formData, setFormData] = useState<ParticipantRequestDTO>({
        id: existingParticipant ? existingParticipant.id : null,
        fullName: existingParticipant ? existingParticipant.fullName : '',
        gender: existingParticipant ? existingParticipant.gender : Gender.MALE,
        dateOfBirth: existingParticipant && 'dateOfBirth' in existingParticipant ? existingParticipant.dateOfBirth : '',
        club: existingParticipant ? existingParticipant.club : '',
        disciplines: existingParticipant ? existingParticipant.disciplines : []
    });

    useEffect(() => {
        if (existingParticipant) {
            setFormData({
                id: existingParticipant.id || null,
                fullName: existingParticipant.fullName || '',
                gender: existingParticipant.gender || Gender.MALE,
                dateOfBirth: 'dateOfBirth' in existingParticipant ? existingParticipant.dateOfBirth : '',
                club: existingParticipant.club || '',
                disciplines: existingParticipant.disciplines || []
            });
        }
    }, [existingParticipant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            disciplines: checked
                ? [...prevFormData.disciplines, value]
                : prevFormData.disciplines.filter(d => d !== value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.id === null) {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            updateMutation.mutate({id: formData.id, data: formData}, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    if (isDisciplinesLoading) {
        return <div>Loading disciplines...</div>;
    }

    if (disciplinesError) {
        return <div>Error loading disciplines: {disciplinesError.message}</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Club</label>
                <input
                    type="text"
                    name="club"
                    value={formData.club}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Disciplines</label>
                <div className="grid grid-cols-2 gap-4">
                    {disciplines?.map((discipline: DisciplineResponseDTO) => (
                        <div key={discipline.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`discipline-${discipline.id}`}
                                name="disciplines"
                                value={discipline.name}
                                checked={formData.disciplines.includes(discipline.name)}
                                onChange={handleDisciplineChange}
                                className="mr-2"
                            />
                            <label htmlFor={`discipline-${discipline.id}`} className="text-sm">
                                {discipline.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default ParticipantForm;
