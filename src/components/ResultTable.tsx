import { useState } from 'react';
import useResult from '../hooks/useResult';
import LoadingSpinner from './LoadingSpinner';
import ResultForm from './ResultForm';
import Modal from './Modal';
import { AgeGroup, Gender } from "../enums";
import { ResultResponseDTO } from '../shared.types';
import Button from '../components/Button';
import toast from "react-hot-toast";
import formatDate from "../utils/formatDate.ts"; // Import the Button component

interface ResultTableProps {
    filters: {
        gender?: Gender;
        ageGroup?: AgeGroup;
        disciplineName: string;
    };
}

const ResultTable = ({ filters }:ResultTableProps) => {
    const { useResultsByDisciplineQuery, useDeleteResultMutation } = useResult();
    const { data: results, error, isLoading } = useResultsByDisciplineQuery(filters);
    const deleteMutation = useDeleteResultMutation();

    const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = (id: number) => {
        setSelectedResultId(id);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Result deleted successfully');
            },
            onError: (error) => {
                toast.error('Error deleting result: ' + error.message);
            }
        });
    };

    const handleCloseModal = () => {
        setSelectedResultId(null);
        setIsEditModalOpen(false);
    };

    const tableHeaderStyle = "py-2 px-4 border-b text-left";
    const tableRowStyle = "py-2 px-4 border-b text-left";

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    if(results?.length === 0) {
        return <div className="text-slate-700">No results found</div>;
    }

    return (
        <div className="container p-4 mx-auto">
            <h1 className="text-2xl font-bold mb-4">Results</h1>
            <div className="overflow-x-auto">
                <table className="min-w-fit bg-white border border-gray-200 table-auto">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className= {tableHeaderStyle}>Participant</th>
                        <th className= {tableHeaderStyle}>Discipline</th>
                        <th className= {tableHeaderStyle}>Result</th>
                        <th className= {tableHeaderStyle}>Date</th>
                        <th className= "py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results?.map((result: ResultResponseDTO) => (
                        <tr
                            key={result.id}
                            className="hover:bg-gray-100 cursor-pointer"
                        >
                            <td className={tableRowStyle}>{result.participantName}</td>
                            <td className={tableRowStyle}>{result.disciplineName}</td>
                            <td className={tableRowStyle}>{result.formattedValue}</td>
                            <td className={tableRowStyle}>{formatDate(result.date)}</td>
                            <td className={tableRowStyle}>
                                <Button
                                    label="Edit"
                                    variant="secondary"
                                    onClick={() => handleEdit(result.id)}
                                    className="mr-2"
                                />
                                <Button
                                    label="Delete"
                                    variant="danger"
                                    onClick={() => handleDelete(result.id)}
                                />
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
