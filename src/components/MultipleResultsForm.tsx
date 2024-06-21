import { useState } from 'react';
import useResult from '../hooks/useResult';
import useParticipant from '../hooks/useParticipant';
import useDiscipline from '../hooks/useDiscipline';
import { ResultRequestDTO } from '../shared.types';
import { ResultType } from '../enums';

interface MultipleResultsFormProps {
    onClose: () => void;
}

const MultipleResultsForm: React.FC<MultipleResultsFormProps> = ({ onClose }) => {
    const { useCreateResultsBatchMutation } = useResult();
    const { useParticipantsQuery } = useParticipant();
    const { useDisciplinesQuery } = useDiscipline();

    const createBatchMutation = useCreateResultsBatchMutation();

    const { data: participants } = useParticipantsQuery();
    const { data: disciplines } = useDisciplinesQuery();

    const [selectedDiscipline, setSelectedDiscipline] = useState<number | undefined>(undefined);
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [results, setResults] = useState<Map<number, string>>(new Map());
    const [resultType, setResultType] = useState<ResultType>(ResultType.TIME);

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const discipline = disciplines?.find(d => d.id === Number(e.target.value));
        setSelectedDiscipline(Number(e.target.value));
        if (discipline) {
            setResultType(discipline.resultType);
        }
    };

    const handleParticipantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
        setSelectedParticipants(selectedOptions);
    };

    const handleResultChange = (participantId: number, value: string) => {
        setResults(prev => new Map(prev).set(participantId, value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Discipline:", selectedDiscipline);
        console.log("Participants:", selectedParticipants);

        if (!selectedDiscipline) {
            console.error("No discipline selected");
            return;
        }
        if (selectedParticipants.length === 0) {
            console.error("No participants selected");
            return;
        }

        const resultsData: ResultRequestDTO[] = selectedParticipants.map(participantId => ({
            participantId,
            disciplineId: selectedDiscipline,
            resultType,
            date: new Date().toISOString().split('T')[0],
            resultValue: results.get(participantId) || ''
        }));

        console.log("Submitting results:", resultsData);

        createBatchMutation.mutate(resultsData, {
            onSuccess: () => {
                console.log("Results submitted successfully");
                onClose();
            },
            onError: (error) => {
                console.error("Error submitting results:", error);
            }
        });
    };

    const getFormatHint = () => {
        switch (resultType) {
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

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Discipline</label>
                <select
                    value={selectedDiscipline}
                    onChange={handleDisciplineChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
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
                <label className="block text-sm font-medium text-gray-700">Participants</label>
                <select
                    multiple
                    value={selectedParticipants.map(String)}
                    onChange={handleParticipantChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                >
                    {participants?.map(participant => (
                        <option key={participant.id} value={participant.id}>
                            {participant.fullName}
                        </option>
                    ))}
                </select>
            </div>
            {selectedParticipants.map(participantId => (
                <div key={participantId} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Result for {participants?.find(p => p.id === participantId)?.fullName}
                    </label>
                    <input
                        type="text"
                        value={results.get(participantId) || ''}
                        onChange={(e) => handleResultChange(participantId, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                    />
                    <p className="text-xs text-gray-500">{getFormatHint()}</p>
                </div>
            ))}
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

export default MultipleResultsForm;

