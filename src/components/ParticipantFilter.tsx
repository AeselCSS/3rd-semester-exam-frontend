import React, { useState } from 'react';
import { Gender, AgeGroup } from '../enums';
import cleanFilters from '../utils/cleanFilters';

interface ParticipantFilterProps {
    onFilterChange: (filters: {
        search?: string;
        gender?: Gender;
        ageGroup?: AgeGroup;
        club?: string;
        discipline?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    }) => void;
}

const ParticipantFilter: React.FC<ParticipantFilterProps> = ({ onFilterChange }) => {
    const [search, setSearch] = useState('');
    const [gender, setGender] = useState<Gender | undefined>(undefined);
    const [ageGroup, setAgeGroup] = useState<AgeGroup | undefined>(undefined);
    const [club, setClub] = useState('');
    const [discipline, setDiscipline] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleFilterChange = () => {
        const filters = {
            search,
            gender,
            ageGroup,
            club,
            discipline,
            sortBy,
            sortDirection,
        };
        onFilterChange(cleanFilters(filters));
    };

    return (
        <div className="mb-4">
            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="">All Genders</option>
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                </select>
                <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="">All Age Groups</option>
                    {Object.values(AgeGroup).map((group) => (
                        <option key={group} value={group}>
                            {group}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Filter by club"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <input
                    type="text"
                    placeholder="Filter by discipline"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="">Sort By</option>
                    <option value="fullName">Name</option>
                    <option value="gender">Gender</option>
                    <option value="ageGroup">Age Group</option>
                    <option value="club">Club</option>
                    <option value="discipline">Discipline</option>
                </select>
                <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <button
                    onClick={handleFilterChange}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default ParticipantFilter;
