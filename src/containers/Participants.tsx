import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import ParticipantTable from '../components/ParticipantTable';
import ParticipantFilter from '../components/ParticipantFilter';
import { Gender, AgeGroup } from '../enums';

const Participants: React.FC = () => {
    const [filters, setFilters] = useState<{
        search?: string;
        gender?: Gender;
        ageGroup?: AgeGroup;
        club?: string;
        discipline?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    }>({});

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    return (
        <PageLayout>
            <ParticipantFilter onFilterChange={handleFilterChange} />
            <ParticipantTable filters={filters} />
        </PageLayout>
    );
};

export default Participants;
