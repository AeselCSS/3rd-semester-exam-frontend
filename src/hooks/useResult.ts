import toast from "react-hot-toast";
import {ResultRequestDTO, ResultResponseDTO} from "../shared.types";
import {AgeGroup, Gender} from "../enums.ts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchAllResultsByDiscipline = async (disciplineName: string, gender?: Gender, ageGroup?: AgeGroup): Promise<ResultResponseDTO[]> => {
    const params = new URLSearchParams({ disciplineName, gender, ageGroup } as Record<string, string>).toString();
    const response = await fetch(`http://localhost:8080/results?${params}`);
    if (!response.ok) {
        toast.error("Failed to fetch results by discipline");
        throw new Error("Failed to fetch results by discipline");
    }
    return response.json();
};

const fetchResultById = async (id: number): Promise<ResultResponseDTO> => {
    const response = await fetch(`http://localhost:8080/results/${id}`);
    if (!response.ok) {
        toast.error("Failed to fetch result by id");
        throw new Error("Failed to fetch result by id");
    }
    return response.json();
};

const createResult = async (resultRequestDTO: ResultRequestDTO): Promise<ResultResponseDTO> => {
    const response = await fetch("http://localhost:8080/results", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resultRequestDTO),
    });
    if (!response.ok) {
        toast.error("Failed to create result");
        throw new Error("Failed to create result");
    }
    return response.json();
};

const createResultsBatch = async (resultRequestDTOs: ResultRequestDTO[]): Promise<ResultResponseDTO[]> => {
    const response = await fetch("http://localhost:8080/results/batch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resultRequestDTOs),
    });
    if (!response.ok) {
        toast.error("Failed to create results batch");
        throw new Error("Failed to create results batch");
    }
    return response.json();
};

const updateResult = async (id: number, resultRequestDTO: ResultRequestDTO): Promise<ResultResponseDTO> => {
    const response = await fetch(`http://localhost:8080/results/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resultRequestDTO),
    });
    if (!response.ok) {
        toast.error("Failed to update result");
        throw new Error("Failed to update result");
    }
    return response.json();
};

const deleteResult = async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/results/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        toast.error("Failed to delete result");
        throw new Error("Failed to delete result");
    }
};

const useResult = () => {
    const queryClient = useQueryClient();

    const useResultsByDisciplineQuery = (disciplineName: string, gender?: Gender, ageGroup?: AgeGroup) => useQuery<ResultResponseDTO[], Error>({
        queryKey: ["results", disciplineName, gender, ageGroup],
        queryFn: () => fetchAllResultsByDiscipline(disciplineName, gender, ageGroup),
    });

    const useResultByIdQuery = (id: number) => useQuery<ResultResponseDTO, Error>({
        queryKey: ["result", id],
        queryFn: () => fetchResultById(id),
    });

    const useCreateResultMutation = () => useMutation<ResultResponseDTO, Error, ResultRequestDTO>({
        mutationFn: createResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        }
    });

    const useCreateResultsBatchMutation = () => useMutation<ResultResponseDTO[], Error, ResultRequestDTO[]>({
        mutationFn: createResultsBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        }
    });

    const useUpdateResultMutation = () => useMutation<ResultResponseDTO, Error, { id: number, data: ResultRequestDTO }>({
        mutationFn: ({ id, data }) => updateResult(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        }
    });

    const useDeleteResultMutation = () => useMutation<void, Error, number>({
        mutationFn: deleteResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results"] });
        }
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