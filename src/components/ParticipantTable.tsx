import React from 'react';
import useParticipant from '../hooks/useParticipant';
import LoadingSpinner from './LoadingSpinner';
import ParticipantDetails from './ParticipantDetails';
import Modal from './Modal';
import formatEnum from '../utils/formatEnum';
import { Gender, AgeGroup } from '../enums';

interface ParticipantTableProps {
    filters: {
        gender?: Gender;
        ageGroup?: AgeGroup;
        club?: string;
        discipline?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    };
}

const ParticipantTable = ({ filters }:ParticipantTableProps) => {
    const { useParticipantsQuery } = useParticipant();
    const { data: participants, error, isLoading } = useParticipantsQuery(filters);

    const [selectedParticipantId, setSelectedParticipantId] = React.useState<number | null>(null);

    const handleRowClick = (id: number) => {
        setSelectedParticipantId(id);
    };

    const handleCloseModal = () => {
        setSelectedParticipantId(null);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Participants</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Full Name</th>
                        <th className="py-2 px-4 border-b">Gender</th>
                        <th className="py-2 px-4 border-b">Age</th>
                        <th className="py-2 px-4 border-b">Age Group</th>
                        <th className="py-2 px-4 border-b">Club</th>
                        <th className="py-2 px-4 border-b">Disciplines</th>
                    </tr>
                    </thead>
                    <tbody>
                    {participants?.map((participant) => (
                        <tr
                            key={participant.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(participant.id)}
                        >
                            <td className="py-2 px-4 border-b">{participant.id}</td>
                            <td className="py-2 px-4 border-b">{participant.fullName}</td>
                            <td className="py-2 px-4 border-b">{formatEnum(participant.gender)}</td>
                            <td className="py-2 px-4 border-b">{participant.age}</td>
                            <td className="py-2 px-4 border-b">{formatEnum(participant.ageGroup)}</td>
                            <td className="py-2 px-4 border-b">{participant.club}</td>
                            <td className="py-2 px-4 border-b">{participant.disciplines.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {selectedParticipantId !== null && (
                <Modal>
                    <ParticipantDetails participantId={selectedParticipantId} onClose={handleCloseModal} />
                </Modal>
            )}
        </div>
    );
};

export default ParticipantTable;
