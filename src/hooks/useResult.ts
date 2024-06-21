import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResultRequestDTO, ResultResponseDTO } from '../shared.types';
import { AgeGroup, Gender } from '../enums';
import toast from 'react-hot-toast';

const fetchResultsByDiscipline = async (params: {
    disciplineName?: string;
    gender?: Gender;
    ageGroup?: AgeGroup;
}): Promise<ResultResponseDTO[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`http://localhost:8080/results?${query}`);
    if (!response.ok) {
        toast.error('Failed to fetch results');
        throw new Error('Failed to fetch results');
    }
    return response.json();
};

const fetchResultById = async (id: number | undefined): Promise<ResultResponseDTO> => {
    const response = await fetch(`http://localhost:8080/results/${id}`);
    if (!response.ok) {
        toast.error("Failed to fetch result by id");
        throw new Error("Failed to fetch result by id");
    }
    return response.json();
};

const createResult = async (result: ResultRequestDTO): Promise<ResultResponseDTO> => {
    const response = await fetch('http://localhost:8080/results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
    });
    if (!response.ok) {
        toast.error('Failed to create result');
        throw new Error('Failed to create result');
    }
    return response.json();
};

const createResultsBatch = async (results: ResultRequestDTO[]): Promise<ResultResponseDTO[]> => {
    const response = await fetch('http://localhost:8080/results/batch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
    });
    if (!response.ok) {
        toast.error('Failed to create results');
        throw new Error('Failed to create results');
    }
    return response.json();
};

const updateResult = async ({ id, data }: { id: number, data: ResultRequestDTO }): Promise<ResultResponseDTO> => {
    const response = await fetch(`http://localhost:8080/results/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        toast.error('Failed to update result');
        throw new Error('Failed to update result');
    }
    return response.json();
};

const deleteResult = async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/results/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        toast.error('Failed to delete result');
        throw new Error('Failed to delete result');
    }
};

const useResult = () => {
    const queryClient = useQueryClient();

    const useResultsByDisciplineQuery = (params: {
        disciplineName?: string;
        gender?: Gender;
        ageGroup?: AgeGroup;
    }) => useQuery<ResultResponseDTO[], Error>({
        queryKey: ['results', params],
        queryFn: () => fetchResultsByDiscipline(params),
    });

    const useResultByIdQuery = (id: number | undefined, options?: { enabled: boolean }) => useQuery<ResultResponseDTO, Error>({
        queryKey: ['result', id],
        queryFn: () => fetchResultById(id),
        ...options,
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
