import { ChangeEvent, FormEvent, useState } from 'react';
import useResult from '../hooks/useResult';
import useParticipant from '../hooks/useParticipant';
import useDiscipline from '../hooks/useDiscipline';
import { ResultRequestDTO } from '../shared.types';
import { ResultType } from '../enums';
import Button from './Button.tsx';
import DynamicResultValueInput from './DynamicResultValueInput.tsx';

interface MultipleResultsFormProps {
    onClose: () => void;
}

const MultipleResultsForm = ({ onClose }: MultipleResultsFormProps) => {
    const { useCreateResultsBatchMutation } = useResult();
    const { useParticipantsQuery } = useParticipant();
    const { useDisciplinesQuery } = useDiscipline();

    const createBatchMutation = useCreateResultsBatchMutation();

    const { data: participants } = useParticipantsQuery();
    const { data: disciplines } = useDisciplinesQuery();

    const [selectedDiscipline, setSelectedDiscipline] = useState<number | string>(''); // Updated initial state
    const [filteredParticipants, setFilteredParticipants] = useState<number[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [results, setResults] = useState<Map<number, string>>(new Map());
    const [resultType, setResultType] = useState<ResultType>(ResultType.TIME);
    const [date, setDate] = useState<string>('');

    const handleDisciplineChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedDiscipline(value);

        if (value !== '') {
            const discipline = disciplines?.find(d => d.id === Number(value));
            if (discipline) {
                setResultType(discipline.resultType);
                const participantIds = participants
                    ?.filter(participant => discipline.participants.includes(participant.fullName))
                    .map(participant => participant.id) || [];
                setFilteredParticipants(participantIds);
                setSelectedParticipants([]); // Reset selected participants when changing discipline
            }
        } else {
            setFilteredParticipants([]);
            setSelectedParticipants([]);
        }
    };

    const handleParticipantChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
        setSelectedParticipants(selectedOptions);
    };

    const handleResultChange = (participantId: number, value: string) => {
        setResults(prev => new Map(prev).set(participantId, value));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (selectedDiscipline === '') {
            console.error("No discipline selected");
            return;
        }
        if (!date) {
            console.error("No date selected");
            return;
        }
        if (selectedParticipants.length === 0) {
            console.error("No participants selected");
            return;
        }

        const resultsData: ResultRequestDTO[] = selectedParticipants.map(participantId => ({
            participantId,
            disciplineId: Number(selectedDiscipline),
            resultType,
            date,
            resultValue: results.get(participantId) || ''
        }));

        createBatchMutation.mutate(resultsData, {
            onSuccess: () => {
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
                <label htmlFor="discipline" className="block text-sm font-medium text-gray-700">Discipline</label>
                <select
                    id="discipline"
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="participants" className="block text-sm font-medium text-gray-700">Participants</label>
                <select
                    id="participants"
                    multiple
                    value={selectedParticipants.map(String)}
                    onChange={handleParticipantChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    required
                >
                    {participants
                        ?.filter(participant => filteredParticipants.includes(participant.id))
                        .map(participant => (
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
                    <DynamicResultValueInput
                        discipline={resultType}
                        value={results.get(participantId) || ''}
                        onChange={(value) => handleResultChange(participantId, value)}
                    />
                    <p className="text-xs text-gray-500">{getFormatHint()}</p>
                </div>
            ))}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    onClick={onClose}
                    label="Cancel"
                    variant="cancel"
                />
                <Button
                    type="submit"
                    label="Save"
                    variant="primary"
                />
            </div>
        </form>
    );
};

export default MultipleResultsForm;
