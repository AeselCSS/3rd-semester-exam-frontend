// test/hooks/useResult.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../setup/test-utils';
import useResult from '../../src/hooks/useResult';
import { mockResults } from '../setup/shared/mockData';
import { server } from '../__mocks__/server';
import { Gender, AgeGroup, ResultType } from '../../src/enums';

describe('useResult Hook', () => {
    beforeEach(() => {
        server.resetHandlers();
    });

    describe('useResultsByDisciplineQuery', () => {
        it('fetches results by discipline without filters', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useResultsByDisciplineQuery({});
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockResults);
        });

        it('fetches filtered results', async () => {
            const filters = {
                disciplineName: '100m Sprint',
                gender: Gender.MALE,
                ageGroup: AgeGroup.SENIOR
            };

            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useResultsByDisciplineQuery(filters);
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.[0].disciplineName).toBe('100m Sprint');
        });
    });

    describe('useResultByIdQuery', () => {
        it('fetches result by ID successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useResultByIdQuery(1);
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockResults[0]);
        });

        it('respects enabled option', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useResultByIdQuery(1, { enabled: false });
            });

            // Should not fetch when disabled
            expect(result.current.isFetching).toBe(false);
        });
    });

    describe('useCreateResultMutation', () => {
        it('creates result successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useCreateResultMutation();
            });

            const newResult = {
                participantId: 1,
                disciplineId: 1,
                resultType: ResultType.TIME,
                date: '2024-03-15',
                resultValue: '10.5s'
            };

            // Trigger the mutation
            result.current.mutate(newResult);

            // Wait for mutation to complete
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            // Then check the result
            expect(result.current.data?.formattedValue).toBe('10.5s');
        });
    });

    describe('useCreateResultsBatchMutation', () => {
        it('creates multiple results successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useCreateResultsBatchMutation();
            });

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

            result.current.mutate(newResults);

            // Wait for mutation to complete
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.length).toBe(2);
        });
    });

    describe('useUpdateResultMutation', () => {
        it('updates result successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useUpdateResultMutation();
            });

            const updateData = {
                id: 1,
                data: {
                    participantId: 1,
                    disciplineId: 1,
                    resultType: ResultType.TIME,
                    date: '2024-03-15',
                    resultValue: '10.2s'
                }
            };

            result.current.mutate(updateData);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.formattedValue).toBe('10.2s');
        });
    });

    describe('useDeleteResultMutation', () => {
        it('deletes result successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useResult();
                return hook.useDeleteResultMutation();
            });

            result.current.mutate(1);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            })
        });
    });
});