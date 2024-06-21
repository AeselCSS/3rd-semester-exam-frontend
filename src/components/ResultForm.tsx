import { useEffect, useState } from "react";
import useResult from '../hooks/useResult';
import useParticipant from '../hooks/useParticipant';
import useDiscipline from '../hooks/useDiscipline';
import { ResultRequestDTO } from '../shared.types';
import { ResultType } from '../enums';

interface ResultFormProps {
    resultId?: number;
    onClose: () => void;
}

const ResultForm: React.FC<ResultFormProps> = ({ resultId, onClose }) => {
    const { useCreateResultMutation, useUpdateResultMutation, useResultByIdQuery } = useResult();
    const { useParticipantsQuery } = useParticipant();
    const { useDisciplinesQuery } = useDiscipline();

    const createMutation = useCreateResultMutation();
    const updateMutation = useUpdateResultMutation();

    const { data: existingResult } = useResultByIdQuery(resultId, { enabled: !!resultId });
    const { data: participants } = useParticipantsQuery();
    const { data: disciplines } = useDisciplinesQuery();

    const [formData, setFormData] = useState<ResultRequestDTO>({
        participantId: 0,
        disciplineId: 0,
        resultType: ResultType.TIME,
        date: '',
        resultValue: ''
    });

    useEffect(() => {
        if (existingResult) {
            setFormData({
                participantId: existingResult.participantId,
                disciplineId: existingResult.disciplineId,
                resultType: existingResult.resultType,
                date: existingResult.date,
                resultValue: existingResult.formattedValue // Use formattedValue directly
            });
        }
    }, [existingResult]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "participantId" || name === "disciplineId" ? Number(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const requestData: ResultRequestDTO = { ...formData };

        if (resultId) {
            updateMutation.mutate({ id: resultId, data: requestData }, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            createMutation.mutate(requestData, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const getFormatHint = () => {
        switch (formData.resultType) {
            case ResultType.TIME:
                return "Format: HH:MM:SS.ss (e.g., 01:23:45.67)";
            case ResultType.DISTANCE:
                return "Format: M.CC (e.g., 123.45)";
            case ResultType.POINTS:
                return "Enter the points as a number";
            default:
                return "";
        }
    };

    const isEditMode = !!resultId;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Participant</label>
                <select
                    name="participantId"
                    value={formData.participantId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                    disabled={isEditMode}
                >
                    <option value="" disabled>Select a participant</option>
                    {participants?.map(participant => (
                        <option key={participant.id} value={participant.id}>
                            {participant.fullName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Discipline</label>
                <select
                    name="disciplineId"
                    value={formData.disciplineId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                    disabled={isEditMode}
                >
                    <option value="" disabled>Select a discipline</option>
                    {disciplines?.map(discipline => (
                        <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Result Type</label>
                <select
                    name="resultType"
                    value={formData.resultType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                    disabled={isEditMode}
                >
                    <option value={ResultType.TIME}>Time</option>
                    <option value={ResultType.DISTANCE}>Distance</option>
                    <option value={ResultType.POINTS}>Points</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Result Value</label>
                <input
                    type="text"
                    name="resultValue"
                    value={formData.resultValue}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                />
                <p className="text-xs text-gray-500">{getFormatHint()}</p>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                    disabled={isEditMode}
                />
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

export default ResultForm;
