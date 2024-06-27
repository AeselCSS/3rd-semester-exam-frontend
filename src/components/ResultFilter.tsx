import { useState } from 'react';
import { Gender, AgeGroup } from '../enums';
import cleanFilters from '../utils/cleanFilters';
import useDiscipline from '../hooks/useDiscipline';
import { DisciplineResponseDTO } from '../shared.types';
import Button from "./Button.tsx";
import LoadingSpinner from "./LoadingSpinner.tsx";

interface ResultFilterProps {
    onFilterChange: (filters: {
        gender?: Gender;
        ageGroup?: AgeGroup;
        disciplineName?: string;
    }) => void;
}

const ResultFilter = ({ onFilterChange }:ResultFilterProps) => {
    const [gender, setGender] = useState<Gender | undefined>(undefined);
    const [ageGroup, setAgeGroup] = useState<AgeGroup | undefined>(undefined);
    const [disciplineName, setDisciplineName] = useState<string>("all");

    const { useDisciplinesQuery } = useDiscipline();
    const { data: disciplines, isLoading: disciplinesLoading, error: disciplinesError } = useDisciplinesQuery();

    const handleFilterChange = () => {
        const filters = {
            gender,
            ageGroup,
            disciplineName: disciplineName || "all", // Ensure default value is set
        };
        onFilterChange(cleanFilters(filters));
    };

    const handleFilterClear = () => {
        setGender(undefined);
        setAgeGroup(undefined);
        setDisciplineName("all");
        onFilterChange({});
    };

    if (disciplinesLoading) {
        return <LoadingSpinner />;
    }

    if (disciplinesError) {
        return <div>An Error occurred while loading disciplines.</div>;
    }

    return (
        <div className="mb-4">
            <div className="flex flex-wrap gap-4">
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
                <select
                    value={disciplineName}
                    onChange={(e) => setDisciplineName(e.target.value || "all")}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="all">All Disciplines</option>
                    {disciplines?.map((discipline: DisciplineResponseDTO) => (
                        <option key={discipline.id} value={discipline.name}>
                            {discipline.name}
                        </option>
                    ))}
                </select>
                <Button
                    onClick={handleFilterChange}
                    label="Apply Filters"
                    variant="primary"
                />
                <Button
                    onClick={handleFilterClear}
                    label="Clear Filters"
                    variant="primary"
                />
            </div>
        </div>
    );
};

export default ResultFilter;
