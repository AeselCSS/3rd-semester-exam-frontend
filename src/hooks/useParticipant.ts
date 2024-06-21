import { ParticipantRequestDTO, ParticipantResponseDTO,} from "../shared.types";
import {AgeGroup, Gender} from "../enums.ts";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchAllParticipants = async (params?: {
    gender?: Gender;
    ageGroup?: AgeGroup;
    club?: string;
    discipline?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}): Promise<ParticipantResponseDTO[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`http://localhost:8080/participant?${query}`);
    if (!response.ok) {
        toast.error("Failed to fetch participants");
        throw new Error("Failed to fetch participants");
    }
    return response.json();
};

const fetchParticipantById = async (id: number): Promise<ParticipantResponseDTO> => {
    const response = await fetch(`http://localhost:8080/participant/id/${id}`);
    if (!response.ok) {
        toast.error("Failed to fetch participant by id");
        throw new Error("Failed to fetch participant by id");
    }
    return response.json();
};

const fetchParticipantByName = async (name: string): Promise<ParticipantResponseDTO> => {
    const response = await fetch(`http://localhost:8080/participant/name/${name}`);
    if (!response.ok) {
        toast.error("Failed to fetch participant by name");
        throw new Error("Failed to fetch participant by name");
    }
    return response.json();
};

const useParticipant = () => {
    const queryClient = useQueryClient();

    const useParticipantsQuery = (params?: {
        gender?: Gender;
        ageGroup?: AgeGroup;
        club?: string;
        discipline?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
    }) => useQuery<ParticipantResponseDTO[], Error>({
        queryKey: ["participants", params],
        queryFn: () => fetchAllParticipants(params),
    });

    const useParticipantByIdQuery = (id: number) => useQuery<ParticipantResponseDTO, Error>({
        queryKey: ["participant", id],
        queryFn: () => fetchParticipantById(id),
    });

    const useParticipantByNameQuery = (name: string) => useQuery<ParticipantResponseDTO, Error>({
        queryKey: ["participant", name],
        queryFn: () => fetchParticipantByName(name),
    });

    const useCreateParticipantMutation = () => useMutation<ParticipantResponseDTO, Error, ParticipantRequestDTO>({
        mutationFn: async (newParticipant: ParticipantRequestDTO) => {
            const response = await fetch("http://localhost:8080/participant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newParticipant),
            });
            if (!response.ok) {
                toast.error("Failed to create participant");
                throw new Error("Failed to create participant");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
        }
    });

    const useUpdateParticipantMutation = () => useMutation<ParticipantResponseDTO, Error, { id: number, data: ParticipantRequestDTO }>({
        mutationFn: async ({ id, data }) => {
            const response = await fetch(`http://localhost:8080/participant/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                toast.error("Failed to update participant");
                throw new Error("Failed to update participant");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
        }
    });

    const useDeleteParticipantMutation = () => useMutation<void, Error, number>({
        mutationFn: async (id: number) => {
            const response = await fetch(`http://localhost:8080/participant/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                toast.error("Failed to delete participant");
                throw new Error("Failed to delete participant");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
        }
    });

    const useAddDisciplineMutation = () => useMutation<ParticipantResponseDTO, Error, { id: number, discipline: string }>({
        mutationFn: async ({ id, discipline }) => {
            const response = await fetch(`http://localhost:8080/participant/${id}/addDiscipline`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: discipline }),
            });
            if (!response.ok) {
                toast.error("Failed to add discipline to participant");
                throw new Error("Failed to add discipline to participant");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
        }
    });

    const useRemoveDisciplineMutation = () => useMutation<ParticipantResponseDTO, Error, { id: number, discipline: string }>({
        mutationFn: async ({ id, discipline }) => {
            const response = await fetch(`http://localhost:8080/participant/${id}/removeDiscipline`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: discipline }),
            });
            if (!response.ok) {
                toast.error("Failed to remove discipline from participant");
                throw new Error("Failed to remove discipline from participant");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
        }
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