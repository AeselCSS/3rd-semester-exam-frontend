import { useState } from 'react';
import PageLayout from '../components/pageLayout/PageLayout.tsx';
import ParticipantTable from '../components/ParticipantTable';
import ParticipantFilter from '../components/ParticipantFilter';
import { Gender, AgeGroup } from '../enums';
import Button from "../components/Button.tsx";
import Modal from "../components/Modal.tsx";
import ParticipantForm from "../components/ParticipantForm.tsx";

const Participants = () => {
    const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
    const [filters, setFilters] = useState<{
        search?: string;
        gender?: Gender;
        ageGroup?: AgeGroup;
        club?: string;
        discipline?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    }>({});

    const handleOpenAddParticipantModal = () => {
        setIsAddParticipantModalOpen(true);
    }

    const handleCloseAddParticipantModal = () => {
        setIsAddParticipantModalOpen(false);
    }

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    return (
        <PageLayout>
            <ParticipantFilter onFilterChange={handleFilterChange} />
            <Button
                onClick={handleOpenAddParticipantModal}
                label="Add Participant"
                variant="primary"
            />
            <ParticipantTable filters={filters} />
            {isAddParticipantModalOpen && (
                <Modal>
                    <ParticipantForm onClose={handleCloseAddParticipantModal} />
                </Modal>
            )}

        </PageLayout>
    );
};

export default Participants;
