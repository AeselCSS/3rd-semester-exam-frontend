import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import useResult from '../hooks/useResult';
import useParticipant from '../hooks/useParticipant';
import useDiscipline from '../hooks/useDiscipline';
import {DisciplineResponseDTO, ResultRequestDTO} from '../shared.types';
import { ResultType, DisciplineType } from '../enums';
import Button from "./Button.tsx";
import DynamicResultValueInput from "./DynamicResultValueInput.tsx";

interface ResultFormProps {
    resultId?: number;
    onClose: () => void;
}

const ResultForm = ({ resultId, onClose }: ResultFormProps) => {
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

    const [filteredDisciplines, setFilteredDisciplines] = useState<DisciplineResponseDTO[]>([]);

    useEffect(() => {
        if (existingResult) {
            setFormData({
                participantId: existingResult.participantId,
                disciplineId: existingResult.disciplineId,
                resultType: existingResult.resultType,
                date: existingResult.date,
                resultValue: existingResult.formattedValue
            });
        }
    }, [existingResult]);

    useEffect(() => {
        if (formData.participantId && participants) {
            const selectedParticipant = participants.find(p => p.id === formData.participantId);
            if (selectedParticipant && disciplines) {
                const participantDisciplines = disciplines.filter(discipline => selectedParticipant.disciplines.includes(discipline.name));
                setFilteredDisciplines(participantDisciplines);
            } else {
                setFilteredDisciplines([]);
            }
        }
    }, [formData.participantId, participants, disciplines]);

    useEffect(() => {
        if (formData.disciplineId && disciplines) {
            const selectedDiscipline = disciplines.find(d => d.id === formData.disciplineId);
            if (selectedDiscipline) {
                let resultType: ResultType;
                switch (selectedDiscipline.disciplineType) {
                    case DisciplineType.RUNNING:
                        resultType = ResultType.TIME;
                        break;
                    case DisciplineType.JUMPING:
                    case DisciplineType.THROWING:
                        resultType = ResultType.DISTANCE;
                        break;
                    case DisciplineType.COMBINED_EVENTS:
                        resultType = ResultType.POINTS;
                        break;
                    default:
                        resultType = ResultType.TIME;
                }
                setFormData(prevFormData => ({
                    ...prevFormData,
                    resultType
                }));
            }
        }
    }, [formData.disciplineId, disciplines]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "participantId" || name === "disciplineId" ? Number(value) : value,
        });
    };

    const handleSubmit = (e: FormEvent) => {
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
                    {filteredDisciplines.map(discipline => (
                        <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Result Value</label>
                <DynamicResultValueInput
                    discipline={formData.resultType}
                    value={formData.resultValue}
                    onChange={(value) => setFormData({ ...formData, resultValue: value })}
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

export default ResultForm;
