import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../setup/test-utils';
import useDiscipline from '../../src/hooks/useDiscipline';
import { mockDisciplines } from '../setup/shared/mockData';
import { server } from '../__mocks__/server';

// NOTE: Tests are currently only testing successcenarios as errors in TanStack Query are acting wierd - i'll need to get back to this.
describe('useDiscipline Hook', () => {
    const {useDisciplinesQuery, useDisciplineByIdQuery, useDisciplineByNameQuery} = useDiscipline();

    beforeEach(() => {
        server.resetHandlers(); // Reset mock handlers to ensure test isolation
    });

    describe('useDisciplinesQuery', () => {
        it('fetches all disciplines successfully', async () => {
            const {result} = renderHook(() => useDisciplinesQuery());

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockDisciplines);
        });

        describe('useDisciplineByIdQuery', () => {
            it('fetches discipline by ID successfully', async () => {
                const {result} = renderHook(() => useDisciplineByIdQuery(1));

                await waitFor(() => {
                    expect(result.current.isSuccess).toBe(true);
                });

                expect(result.current.data).toEqual(mockDisciplines[0]);
            });
        });

        describe('useDisciplineByNameQuery', () => {
            it('fetches discipline by name successfully', async () => {
                const {result} = renderHook(() =>
                    useDisciplineByNameQuery('100m Sprint')
                );

                await waitFor(() => {
                    expect(result.current.isSuccess).toBe(true);
                });

                expect(result.current.data).toEqual(mockDisciplines[0]);
            });
        });
    });
});
