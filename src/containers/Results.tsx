import  { useState } from 'react';
import Modal from '../components/Modal';
import ResultForm from '../components/ResultForm';
import MultipleResultsForm from '../components/MultipleResultsForm';
import ResultFilter from '../components/ResultFilter';
import ResultTable from '../components/ResultTable';
import { Gender, AgeGroup } from '../enums';
import PageLayout from "../components/pageLayout/PageLayout.tsx";
import Button from '../components/Button.tsx'; // Import the Button component

const ResultsContainer = () => {
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
            <div className="flex gap-4 mb-4">
                <Button
                    onClick={handleOpenSingleResultModal}
                    label="Add Result"
                    variant="primary"
                />
                <Button
                    onClick={handleOpenMultipleResultsModal}
                    label="Add Multiple Results"
                    variant="primary"
                />
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
