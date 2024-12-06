// test/unit/services/disciplineService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '../../__mocks__/server';
import { disciplineErrorHandlers } from '../../__mocks__/handlers/disciplineHandlers';
import {
    fetchAllDisciplines,
    fetchDisciplineById,
    fetchDisciplineByName
} from '../../../src/services/disciplineService';
import { mockDisciplines } from '../../setup/shared/mockData';

// Mock the entire module
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
        loading: vi.fn()
    }
}));

import toast from 'react-hot-toast';

describe('DisciplineService', () => {
    beforeEach(() => {
        server.resetHandlers();
        vi.clearAllMocks(); // Clear mock history before each test
    });

    describe('fetchAllDisciplines', () => {
        it('should fetch all disciplines successfully', async () => {
            const disciplines = await fetchAllDisciplines();

            expect(disciplines).toEqual(mockDisciplines);
            expect(disciplines).toHaveLength(2);
            expect(disciplines[0].name).toBe('100m Sprint');
        });

        it('should handle fetch error', async () => {
            server.use(...disciplineErrorHandlers);

            await expect(fetchAllDisciplines()).rejects.toThrow('Failed to fetch disciplines');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch disciplines');
        });
    });

    describe('fetchDisciplineById', () => {
        it('should fetch discipline by id successfully', async () => {
            const discipline = await fetchDisciplineById(1);

            expect(discipline).toEqual(mockDisciplines[0]);
            expect(discipline.name).toBe('100m Sprint');
        });

        it('should handle non-existent discipline', async () => {
            await expect(fetchDisciplineById(999)).rejects.toThrow('Failed to fetch discipline by id');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch discipline by id');
        });

        it('should handle fetch error', async () => {
            server.use(...disciplineErrorHandlers);

            await expect(fetchDisciplineById(1)).rejects.toThrow('Failed to fetch discipline by id');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch discipline by id');
        });
    });

    describe('fetchDisciplineByName', () => {
        it('should fetch discipline by name successfully', async () => {
            const discipline = await fetchDisciplineByName('100m Sprint');

            expect(discipline).toEqual(mockDisciplines[0]);
            expect(discipline.id).toBe(1);
        });

        it('should handle non-existent discipline name', async () => {
            await expect(fetchDisciplineByName('Non-existent')).rejects.toThrow('Failed to fetch discipline by name');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch discipline by name');
        });

        it('should handle fetch error', async () => {
            server.use(...disciplineErrorHandlers);

            await expect(fetchDisciplineByName('100m Sprint')).rejects.toThrow('Failed to fetch discipline by name');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch discipline by name');
        });
    });
});