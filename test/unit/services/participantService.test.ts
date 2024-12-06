// test/unit/services/participantService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '../../__mocks__/server';
import { participantErrorHandlers } from '../../__mocks__/handlers/participantHandlers';
import {
    fetchAllParticipants,
    fetchParticipantById,
    fetchParticipantByName,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    addDiscipline,
    removeDiscipline
} from '../../../src/services/participantService';
import { mockParticipants } from '../../setup/shared/mockData';
import { Gender, AgeGroup } from '../../../src/enums';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
        loading: vi.fn()
    }
}));

import toast from 'react-hot-toast';

describe('ParticipantService', () => {
    beforeEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    describe('fetchAllParticipants', () => {
        it('should fetch all participants without filters', async () => {
            const participants = await fetchAllParticipants();

            expect(participants).toEqual(mockParticipants);
            expect(participants).toHaveLength(2);
        });

        it('should fetch participants with gender filter', async () => {
            const participants = await fetchAllParticipants({ gender: Gender.MALE });

            expect(participants).toHaveLength(1);
            expect(participants[0].gender).toBe(Gender.MALE);
        });

        it('should fetch participants with multiple filters', async () => {
            const participants = await fetchAllParticipants({
                gender: Gender.MALE,
                ageGroup: AgeGroup.SENIOR,
                club: 'Athletic Club'
            });

            expect(participants[0].gender).toBe(Gender.MALE);
            expect(participants[0].ageGroup).toBe(AgeGroup.SENIOR);
        });

        it('should handle fetch error', async () => {
            server.use(...participantErrorHandlers);

            await expect(fetchAllParticipants()).rejects.toThrow('Failed to fetch participants');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch participants');
        });
    });

    describe('fetchParticipantById', () => {
        it('should fetch participant by id successfully', async () => {
            const participant = await fetchParticipantById(1);

            expect(participant).toEqual(mockParticipants[0]);
            expect(participant.fullName).toBe('John Doe');
        });

        it('should handle non-existent participant', async () => {
            await expect(fetchParticipantById(999)).rejects.toThrow('Failed to fetch participant by id');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch participant by id');
        });
    });

    describe('fetchParticipantByName', () => {
        it('should fetch participant by name successfully', async () => {
            const participant = await fetchParticipantByName('John Doe');

            expect(participant).toEqual(mockParticipants[0]);
            expect(participant.id).toBe(1);
        });

        it('should handle non-existent name', async () => {
            await expect(fetchParticipantByName('Non Existent')).rejects.toThrow('Failed to fetch participant by name');
            expect(toast.error).toHaveBeenCalledWith('Failed to fetch participant by name');
        });
    });

    describe('createParticipant', () => {
        it('should create participant successfully', async () => {
            const newParticipant = {
                id: null,
                fullName: 'New Participant',
                gender: Gender.MALE,
                dateOfBirth: '1995-01-01',
                club: 'New Club',
                disciplines: ['100m Sprint']
            };

            const response = await createParticipant(newParticipant);

            expect(response.id).toBeDefined();
            expect(response.fullName).toBe(newParticipant.fullName);
            expect(response.club).toBe(newParticipant.club);
        });

        it('should handle creation error', async () => {
            server.use(...participantErrorHandlers);

            const newParticipant = {
                id: null,
                fullName: 'New Participant',
                gender: Gender.MALE,
                dateOfBirth: '1995-01-01',
                club: 'New Club',
                disciplines: ['100m Sprint']
            };

            await expect(createParticipant(newParticipant)).rejects.toThrow('Failed to create participant');
            expect(toast.error).toHaveBeenCalledWith('Failed to create participant');
        });
    });

    describe('updateParticipant', () => {
        it('should update participant successfully', async () => {
            const updateData = {
                id: 1,  // Changed from null to 1
                fullName: 'Updated Name',
                gender: Gender.MALE,
                dateOfBirth: '1995-01-01',
                club: 'Updated Club',
                disciplines: ['100m Sprint']
            };

            const response = await updateParticipant({ id: 1, data: updateData });

            expect(response.id).toBe(1);
            expect(response.fullName).toBe(updateData.fullName);
            expect(response.club).toBe(updateData.club);
        });

        it('should handle update error', async () => {
            server.use(...participantErrorHandlers);

            const updateData = {
                id: 1,  // Changed from null to 1
                fullName: 'Updated Name',
                gender: Gender.MALE,
                dateOfBirth: '1995-01-01',
                club: 'Updated Club',
                disciplines: ['100m Sprint']
            };

            await expect(updateParticipant({ id: 1, data: updateData }))
                .rejects.toThrow('Failed to update participant');
            expect(toast.error).toHaveBeenCalledWith('Failed to update participant');
        });
    });

    describe('deleteParticipant', () => {
        it('should delete participant successfully', async () => {
            await expect(deleteParticipant(1)).resolves.not.toThrow();
        });

        it('should handle deletion error', async () => {
            server.use(...participantErrorHandlers);

            await expect(deleteParticipant(1)).rejects.toThrow('Failed to delete participant');
            expect(toast.error).toHaveBeenCalledWith('Failed to delete participant');
        });
    });

    describe('addDiscipline', () => {
        it('should add discipline to participant successfully', async () => {
            const response = await addDiscipline({ id: 1, discipline: 'Long Jump' });

            expect(response.disciplines).toContain('Long Jump');
        });

        it('should handle add discipline error', async () => {
            server.use(...participantErrorHandlers);

            await expect(addDiscipline({ id: 1, discipline: 'Long Jump' }))
                .rejects.toThrow('Failed to add discipline to participant');
            expect(toast.error).toHaveBeenCalledWith('Failed to add discipline to participant');
        });
    });

    describe('removeDiscipline', () => {
        it('should remove discipline from participant successfully', async () => {
            const response = await removeDiscipline({ id: 1, discipline: '100m Sprint' });

            expect(response.disciplines).not.toContain('100m Sprint');
        });

        it('should handle remove discipline error', async () => {
            server.use(...participantErrorHandlers);

            await expect(removeDiscipline({ id: 1, discipline: '100m Sprint' }))
                .rejects.toThrow('Failed to remove discipline from participant');
            expect(toast.error).toHaveBeenCalledWith('Failed to remove discipline from participant');
        });
    });
});