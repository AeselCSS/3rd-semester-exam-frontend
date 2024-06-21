import React, { useState } from 'react';
import Modal from '../components/Modal';
import ResultForm from '../components/ResultForm';
import MultipleResultsForm from '../components/MultipleResultsForm';
import ResultFilter from '../components/ResultFilter';
import ResultTable from '../components/ResultTable';
import { Gender, AgeGroup } from '../enums';
import PageLayout from "../components/PageLayout.tsx";

const ResultsContainer: React.FC = () => {
    const [isSingleResultModalOpen, setIsSingleResultModalOpen] = useState(false);
    const [isMultipleResultsModalOpen, setIsMultipleResultsModalOpen] = useState(false);
    const [filters, setFilters] = useState<{ gender?: Gender; ageGroup?: AgeGroup; disciplineName?: string }>({});
    const [selectedResultId, setSelectedResultId] = useState<number | null>(null);

    const handleOpenSingleResultModal = () => {
        setSelectedResultId(null);  // Reset the selected result ID when adding a new result
        setIsSingleResultModalOpen(true);
    };

    const handleOpenMultipleResultsModal = () => {
        setIsMultipleResultsModalOpen(true);
    };

    const handleCloseSingleResultModal = () => {
        setIsSingleResultModalOpen(false);
    };

    const handleCloseMultipleResultsModal = () => {
        setIsMultipleResultsModalOpen(false);
    };

    const handleFilterChange = (newFilters: { gender?: Gender; ageGroup?: AgeGroup; disciplineName?: string }) => {
        setFilters(newFilters);
    };

    return (
        <PageLayout>
            <ResultFilter onFilterChange={handleFilterChange} />
            <div className="flex justify-between mb-4">
                <button
                    onClick={handleOpenSingleResultModal}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Add Result
                </button>
                <button
                    onClick={handleOpenMultipleResultsModal}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Add Multiple Results
                </button>
            </div>
            <ResultTable filters={{...filters, disciplineName: filters.disciplineName || ''}} />
            {isSingleResultModalOpen && (
                <Modal>
                    <ResultForm onClose={handleCloseSingleResultModal} resultId={selectedResultId === null ? undefined : selectedResultId} />
                </Modal>
            )}
            {isMultipleResultsModalOpen && (
                <Modal>
                    <MultipleResultsForm onClose={handleCloseMultipleResultsModal} />
                </Modal>
            )}
        </PageLayout>
    );
};

export default ResultsContainer;
