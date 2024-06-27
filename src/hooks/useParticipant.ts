import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParticipantRequestDTO, ParticipantResponseDTO } from '../shared.types';
import { AgeGroup, Gender } from '../enums';
import toast from 'react-hot-toast';
import { fetchAllParticipants, fetchParticipantById, fetchParticipantByName, createParticipant, updateParticipant, deleteParticipant, addDiscipline, removeDiscipline } from '../services/participantService';
import {queryConfig} from "../config/queryConfig.ts";



const useParticipant = () => {
    const queryClient = useQueryClient();

    const useParticipantsQuery = (params?: {
        search?: string;
        gender?: Gender;
        ageGroup?: AgeGroup;
        club?: string;
        discipline?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    }) => useQuery<ParticipantResponseDTO[], Error>({
        queryKey: ['participants', params],
        queryFn: () => fetchAllParticipants(params), ...queryConfig.mediumLivedData
    });


    const useParticipantByIdQuery = (id: number) => useQuery<ParticipantResponseDTO, Error>({
        queryKey: ['participant', id],
        queryFn: () => fetchParticipantById(id), ...queryConfig.mediumLivedData
    });

    const useParticipantByNameQuery = (name: string) => useQuery<ParticipantResponseDTO, Error>({
        queryKey: ['participant', name],
        queryFn: () => fetchParticipantByName(name), ...queryConfig.mediumLivedData
    });

    const useCreateParticipantMutation = () => useMutation<ParticipantResponseDTO, Error, ParticipantRequestDTO>({
        mutationFn: createParticipant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participants'] });
            toast.success('Participant created successfully');
        },
    });

    const useUpdateParticipantMutation = () => useMutation<ParticipantResponseDTO, Error, { id: number, data: ParticipantRequestDTO }>({
        mutationFn: updateParticipant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participants'] });
            toast.success('Participant updated successfully');
        },
    });

    const useDeleteParticipantMutation = () => useMutation<void, Error, number>({
        mutationFn: deleteParticipant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participants'] });
            toast.success('Participant deleted successfully');
        },
    });

    const useAddDisciplineMutation = () => useMutation<ParticipantResponseDTO, Error, { id: number, discipline: string }>({
        mutationFn: addDiscipline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participant'] });
            toast.success('Discipline added successfully');
        },
    });

    const useRemoveDisciplineMutation = () => useMutation<ParticipantResponseDTO, Error, { id: number, discipline: string }>({
        mutationFn: removeDiscipline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['participant'] });
            toast.success('Discipline removed successfully');
        },
    });

    return {
        useParticipantsQuery,
        useParticipantByIdQuery,
        useParticipantByNameQuery,
        useCreateParticipantMutation,
        useUpdateParticipantMutation,
        useDeleteParticipantMutation,
        useAddDisciplineMutation,
        useRemoveDisciplineMutation,
    };
};

export default useParticipant;
