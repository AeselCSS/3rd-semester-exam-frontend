import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../setup/test-utils';
import useParticipant from '../../src/hooks/useParticipant';
import { mockParticipants } from '../setup/shared/mockData';
import { server } from '../__mocks__/server';
import { Gender, AgeGroup } from '../../src/enums';

describe('useParticipant Hook', () => {
    beforeEach(() => {
        server.resetHandlers();
    });

    describe('useParticipantsQuery', () => {
        it('fetches all participants successfully without filters', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useParticipantsQuery();
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockParticipants);
        });

        it('fetches filtered participants successfully', async () => {
            const filters = {
                gender: Gender.MALE,
                ageGroup: AgeGroup.SENIOR,
                club: 'Athletic Club'
            };

            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useParticipantsQuery(filters);
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.[0].gender).toBe(Gender.MALE);
            expect(result.current.data?.[0].ageGroup).toBe(AgeGroup.SENIOR);
            expect(result.current.data?.[0].club).toBe('Athletic Club');
        });
    });

    describe('useParticipantByIdQuery', () => {
        it('fetches participant by ID successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useParticipantByIdQuery(1);
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockParticipants[0]);
        });
    });

    describe('useParticipantByNameQuery', () => {
        it('fetches participant by name successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useParticipantByNameQuery('John Doe');
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockParticipants[0]);
        });
    });

    describe('useCreateParticipantMutation', () => {
        it('creates participant successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useCreateParticipantMutation();
            });

            const newParticipant = {
                id: null,
                fullName: 'New Participant',
                gender: Gender.MALE,
                dateOfBirth: '1995-01-01',
                club: 'New Club',
                disciplines: ['100m Sprint']
            };

            result.current.mutate(newParticipant);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.fullName).toBe('New Participant');
        });
    });

    describe('useUpdateParticipantMutation', () => {
        it('updates participant successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useUpdateParticipantMutation();
            });

            const updateData = {
                id: 1,
                data: {
                    id: 1,
                    fullName: 'Updated Name',
                    gender: Gender.MALE,
                    dateOfBirth: '1995-01-01',
                    club: 'Updated Club',
                    disciplines: ['100m Sprint']
                }
            };

            result.current.mutate(updateData);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.fullName).toBe('Updated Name');
        });
    });

    describe('useDeleteParticipantMutation', () => {
        it('deletes participant successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useDeleteParticipantMutation();
            });

            result.current.mutate(1);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });
    });

    describe('useAddDisciplineMutation', () => {
        it('adds discipline to participant successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useAddDisciplineMutation();
            });

            result.current.mutate({ id: 1, discipline: 'Long Jump' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
            expect(result.current.data?.disciplines).toContain('Long Jump');
        });
    });

    describe('useRemoveDisciplineMutation', () => {
        it('removes discipline from participant successfully', async () => {
            const { result } = renderHook(() => {
                const hook = useParticipant();
                return hook.useRemoveDisciplineMutation();
            });

            result.current.mutate({ id: 1, discipline: '100m Sprint' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
            expect(result.current.data?.disciplines).not.toContain('100m Sprint');
        });
    });
});