import React, { useState } from 'react';
import useParticipant from '../hooks/useParticipant';
import formatEnum from '../utils/formatEnum';
import { DisciplineResponseDTO } from '../shared.types';
import useDiscipline from '../hooks/useDiscipline';
import Button from "./Button.tsx";
import { FaRegTrashCan } from "react-icons/fa6";

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
                <Button
                    onClick={onClose}
                    label="X"
                    variant="close"
                />
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
                                <Button
                                    onClick={() => handleRemoveDiscipline(discipline)}
                                    label={<FaRegTrashCan size={14}/>}
                                    variant="danger"
                                    className="mb-2"
                                />
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
                        <Button
                            onClick={handleAddDiscipline}
                            label="Add"
                            variant="primary"
                        />
                    </div>
                    <h2 className="text-xl font-bold mt-6">Danger Zone</h2>
                    <div className="flex justify-start mt-4">
                        <Button
                            onClick={handleDelete}
                            label="Delete Participant"
                            variant="danger"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantDetails;
