import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '../../__mocks__/server';
import { resultErrorHandlers } from '../../__mocks__/handlers/resultHandlers';
import {
    fetchResultsByDiscipline,
    fetchResultById,
    createResult,
    createResultsBatch,
    updateResult,
    deleteResult
} from '../../../src/services/resultService';
import { mockResults } from '../../setup/shared/mockData';
import { Gender, AgeGroup, ResultType } from '../../../src/enums';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
        loading: vi.fn()
    }
}));

import toast from 'react-hot-toast';

describe('ResultService', () => {
    beforeEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    describe('fetchResultsByDiscipline', () => {
        it('should fetch all results without filters', async () => {
            const results = await fetchResultsByDiscipline({});

            expect(results).toEqual(mockResults);
            expect(results).toHaveLength(2);
        });

        it('should fetch results with disciplineName filter', async () => {
            const results = await fetchResultsByDiscipline({
                disciplineName: '100m Sprint'
            });

            expect(results).toHaveLength(1);
            expect(results[0].disciplineName).toBe('100m Sprint');
        });

        it('should fetch results with multiple filters', async () => {
            const results = await fetchResultsByDiscipline({
                disciplineName: '100m Sprint',
                gender: Gender.MALE,
                ageGroup: AgeGroup.SENIOR
            });

            expect(results[0].disciplineName).toBe('100m Sprint');
            expect(results[0].participantId).toBe(1); // John Doe's ID
        });

        it('should handle fetch error', async () => {
            server.use(...resultErrorHandlers);

            await expect(fetchResultsByDiscipline({}))
                .rejects.toThrow('Failed to fetch results');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch results');
        });
    });

    describe('fetchResultById', () => {
        it('should fetch result by id successfully', async () => {
            const result = await fetchResultById(1);

            expect(result).toEqual(mockResults[0]);
            expect(result.disciplineName).toBe('100m Sprint');
        });

        it('should handle non-existent result', async () => {
            await expect(fetchResultById(999))
                .rejects.toThrow('Failed to fetch result by id');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch result by id');
        });
    });

    describe('createResult', () => {
        it('should create result successfully', async () => {
            const newResult = {
                participantId: 1,
                disciplineId: 1,
                resultType: ResultType.TIME,
                date: '2024-03-15',
                resultValue: '10.5s'
            };

            const response = await createResult(newResult);

            expect(response.id).toBe(3); // Since we have 2 existing results
            expect(response.formattedValue).toBe(newResult.resultValue);
            expect(response.participantId).toBe(newResult.participantId);
        });

        it('should handle creation error', async () => {
            server.use(...resultErrorHandlers);

            const newResult = {
                participantId: 1,
                disciplineId: 1,
                resultType: ResultType.TIME,
                date: '2024-03-15',
                resultValue: '10.5s'
            };

            await expect(createResult(newResult))
                .rejects.toThrow('Failed to create result');
            expect(toast.error).toHaveBeenCalledWith('Failed to create result');
        });
    });

    describe('createResultsBatch', () => {
        it('should create multiple results successfully', async () => {
            const newResults = [
                {
                    participantId: 1,
                    disciplineId: 1,
                    resultType: ResultType.TIME,
                    date: '2024-03-15',
                    resultValue: '10.5s'
                },
                {
                    participantId: 2,
                    disciplineId: 2,
                    resultType: ResultType.DISTANCE,
                    date: '2024-03-15',
                    resultValue: '7.5m'
                }
            ];

            const responses = await createResultsBatch(newResults);

            expect(responses).toHaveLength(2);
            expect(responses[0].formattedValue).toBe(newResults[0].resultValue);
            expect(responses[1].formattedValue).toBe(newResults[1].resultValue);
        });

        it('should handle batch creation error', async () => {
            server.use(...resultErrorHandlers);

            const newResults = [{
                participantId: 1,
                disciplineId: 1,
                resultType: ResultType.TIME,
                date: '2024-03-15',
                resultValue: '10.5s'
            }];

            await expect(createResultsBatch(newResults))
                .rejects.toThrow('Failed to create results');
            expect(toast.error).toHaveBeenCalledWith('Failed to create results');
        });
    });

    describe('updateResult', () => {
        it('should update result successfully', async () => {
            const updateData = {
                participantId: 1,
                disciplineId: 1,
                resultType: ResultType.TIME,
                date: '2024-03-15',
                resultValue: '10.2s'
            };

            const response = await updateResult({ id: 1, data: updateData });

            expect(response.id).toBe(1);
            expect(response.formattedValue).toBe(updateData.resultValue);
        });

        it('should handle update error', async () => {
            server.use(...resultErrorHandlers);

            const updateData = {
                participantId: 1,
                disciplineId: 1,
                resultType: ResultType.TIME,
                date: '2024-03-15',
                resultValue: '10.2s'
            };

            await expect(updateResult({ id: 1, data: updateData }))
                .rejects.toThrow('Failed to update result');
            expect(toast.error).toHaveBeenCalledWith('Failed to update result');
        });
    });

    describe('deleteResult', () => {
        it('should delete result successfully', async () => {
            await expect(deleteResult(1)).resolves.not.toThrow();
        });

        it('should handle deletion error', async () => {
            server.use(...resultErrorHandlers);

            await expect(deleteResult(1))
                .rejects.toThrow('Failed to delete result');
            expect(toast.error).toHaveBeenCalledWith('Failed to delete result');
        });
    });
});