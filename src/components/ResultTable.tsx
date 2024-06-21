import React from 'react';
import useResult from '../hooks/useResult';
import LoadingSpinner from './LoadingSpinner';
import ResultForm from './ResultForm';
import Modal from './Modal';
import { AgeGroup, Gender } from "../enums";
import { ResultResponseDTO } from '../shared.types';

interface ResultTableProps {
    filters: {
        gender?: Gender;
        ageGroup?: AgeGroup;
        disciplineName: string;
    };
}

const ResultTable: React.FC<ResultTableProps> = ({ filters }) => {
    const { useResultsByDisciplineQuery, useDeleteResultMutation } = useResult();
    const { data: results, error, isLoading } = useResultsByDisciplineQuery(filters);
    const deleteMutation = useDeleteResultMutation();

    const [selectedResultId, setSelectedResultId] = React.useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

    const handleRowClick = (id: number) => {
        setSelectedResultId(id);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                console.log(`Result with ID ${id} deleted successfully`);
            },
            onError: (error) => {
                console.error(`Failed to delete result with ID ${id}`, error);
            }
        });
    };

    const handleCloseModal = () => {
        setSelectedResultId(null);
        setIsEditModalOpen(false);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Results</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Participant</th>
                        <th className="py-2 px-4 border-b">Discipline</th>
                        <th className="py-2 px-4 border-b">Result Type</th>
                        <th className="py-2 px-4 border-b">Result</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results?.map((result: ResultResponseDTO) => (
                        <tr
                            key={result.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(result.id)}
                        >
                            <td className="py-2 px-4 border-b">{result.id}</td>
                            <td className="py-2 px-4 border-b">{result.participantName}</td>
                            <td className="py-2 px-4 border-b">{result.disciplineName}</td>
                            <td className="py-2 px-4 border-b">{result.resultType}</td>
                            <td className="py-2 px-4 border-b">{result.formattedValue}</td>
                            <td className="py-2 px-4 border-b">{result.date}</td>
                            <td className="py-2 px-4 border-b">
                                <button className="text-slate-500 mr-2 bg-slate-300 rounded p-1" onClick={() => handleRowClick(result.id)}>Edit</button>
                                <button className="text-white bg-red-500 rounded p-1" onClick={() => handleDelete(result.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isEditModalOpen && selectedResultId !== null && (
                <Modal>
                    <ResultForm resultId={selectedResultId} onClose={handleCloseModal} />
                </Modal>
            )}
        </div>
    );
};

export default ResultTable;
