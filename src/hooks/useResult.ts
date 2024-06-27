import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResultRequestDTO, ResultResponseDTO } from '../shared.types';
import { AgeGroup, Gender } from '../enums';
import toast from 'react-hot-toast';
import { createResult, createResultsBatch, deleteResult, fetchResultById, fetchResultsByDiscipline, updateResult } from '../services/resultService';
import {queryConfig} from "../config/queryConfig.ts";

const useResult = () => {
    const queryClient = useQueryClient();

    const useResultsByDisciplineQuery = (params: {
        disciplineName?: string;
        gender?: Gender;
        ageGroup?: AgeGroup;
    }) => useQuery<ResultResponseDTO[], Error>({
        queryKey: ['results', params],
        queryFn: () => fetchResultsByDiscipline(params), ...queryConfig.mediumLivedData
    });

    const useResultByIdQuery = (id: number | undefined, options?: { enabled: boolean }) => useQuery<ResultResponseDTO, Error>({
        queryKey: ['result', id],
        queryFn: () => fetchResultById(id), ...queryConfig.shortLivedData ,...options,
    });

    const useCreateResultMutation = () => useMutation<ResultResponseDTO, Error, ResultRequestDTO>({
        mutationFn: createResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['results'] });
            toast.success('Result created successfully');
        },
    });

    const useCreateResultsBatchMutation = () => useMutation<ResultResponseDTO[], Error, ResultRequestDTO[]>({
        mutationFn: createResultsBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['results'] });
            toast.success('Results created successfully');
        },
    });

    const useUpdateResultMutation = () => useMutation<ResultResponseDTO, Error, { id: number, data: ResultRequestDTO }>({
        mutationFn: updateResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['results'] });
            toast.success('Result updated successfully');
        },
    });

    const useDeleteResultMutation = () => useMutation<void, Error, number>({
        mutationFn: deleteResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['results'] });
            toast.success('Result deleted successfully');
        },
    });

    return {
        useResultsByDisciplineQuery,
        useResultByIdQuery,
        useCreateResultMutation,
        useCreateResultsBatchMutation,
        useUpdateResultMutation,
        useDeleteResultMutation,
    };
};

export default useResult;
