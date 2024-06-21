import React, { useState } from 'react';
import useParticipant from '../hooks/useParticipant';
import formatEnum from '../utils/formatEnum';
import { DisciplineResponseDTO } from '../shared.types';
import useDiscipline from '../hooks/useDiscipline';

interface ParticipantDetailsProps {
    participantId: number;
    onClose: () => void;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = ({ participantId, onClose }) => {
    const { useParticipantByIdQuery, useDeleteParticipantMutation, useAddDisciplineMutation, useRemoveDisciplineMutation } = useParticipant();
    const { useDisciplinesQuery } = useDiscipline();
    const { data: participant, error, isLoading } = useParticipantByIdQuery(participantId);
    const { data: disciplines } = useDisciplinesQuery();

    const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');

    const deleteMutation = useDeleteParticipantMutation();
    const addDisciplineMutation = useAddDisciplineMutation();
    const removeDisciplineMutation = useRemoveDisciplineMutation();

    const handleAddDiscipline = () => {
        if (selectedDiscipline) {
            addDisciplineMutation.mutate({ id: participantId, discipline: selectedDiscipline });
        }
    };

    const handleRemoveDiscipline = (discipline: string) => {
        removeDisciplineMutation.mutate({ id: participantId, discipline });
    };

    const handleDelete = () => {
        deleteMutation.mutate(participantId, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Participant Details</h2>
                <button onClick={onClose} className="text-red-500">Close</button>
            </div>
            {participant && (
                <div>
                    <p><strong>ID:</strong> {participant.id}</p>
                    <p><strong>Full Name:</strong> {participant.fullName}</p>
                    <p><strong>Gender:</strong> {formatEnum(participant.gender)}</p>
                    <p><strong>Age:</strong> {participant.age}</p>
                    <p><strong>Age Group:</strong> {formatEnum(participant.ageGroup)}</p>
                    <p><strong>Club:</strong> {participant.club}</p>
                    <p><strong>Disciplines:</strong></p>
                    <ul>
                        {participant.disciplines.map((discipline) => (
                            <li key={discipline} className="flex items-center justify-between">
                                {discipline}
                                <button
                                    onClick={() => handleRemoveDiscipline(discipline)}
                                    className="text-red-500 ml-4"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center mt-4">
                        <select
                            value={selectedDiscipline}
                            onChange={(e) => setSelectedDiscipline(e.target.value)}
                            className="mr-2 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        >
                            <option value="" disabled>Select discipline</option>
                            {disciplines?.map((discipline: DisciplineResponseDTO) => (
                                <option key={discipline.id} value={discipline.name}>
                                    {discipline.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddDiscipline}
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Add Discipline
                        </button>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleDelete}
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            Delete Participant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantDetails;
