import {AgeGroup, Gender} from "../enums.ts";
import {ParticipantRequestDTO, ParticipantResponseDTO} from "../shared.types";
import cleanFilters from "../utils/cleanFilters.ts";
import toast from "react-hot-toast";

const fetchAllParticipants = async (params?: {
    search?: string;
    gender?: Gender;
    ageGroup?: AgeGroup;
    club?: string;
    discipline?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}): Promise<ParticipantResponseDTO[]> => {
    const query = new URLSearchParams(cleanFilters(params || {}) as Record<string, string>).toString();
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

const createParticipant = async (participant: ParticipantRequestDTO): Promise<ParticipantResponseDTO> => {
    const response = await fetch('http://localhost:8080/participant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(participant),
    });
    if (!response.ok) {
        toast.error('Failed to create participant');
        throw new Error('Failed to create participant');
    }
    return response.json();
};

const updateParticipant = async ({ id, data }: { id: number, data: ParticipantRequestDTO }): Promise<ParticipantResponseDTO> => {
    const response = await fetch(`http://localhost:8080/participant/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        toast.error('Failed to update participant');
        throw new Error('Failed to update participant');
    }
    return response.json();
};

const deleteParticipant = async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/participant/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        toast.error('Failed to delete participant');
        throw new Error('Failed to delete participant');
    }
};

const addDiscipline = async ({ id, discipline }: { id: number, discipline: string }): Promise<ParticipantResponseDTO> => {
    const response = await fetch(`http://localhost:8080/participant/${id}/addDiscipline`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: discipline }),
    });
    if (!response.ok) {
        toast.error('Failed to add discipline to participant');
        throw new Error('Failed to add discipline to participant');
    }
    return response.json();
};

const removeDiscipline = async ({ id, discipline }: { id: number, discipline: string }): Promise<ParticipantResponseDTO> => {
    const response = await fetch(`http://localhost:8080/participant/${id}/removeDiscipline`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: discipline }),
    });
    if (!response.ok) {
        toast.error('Failed to remove discipline from participant');
        throw new Error('Failed to remove discipline from participant');
    }
    return response.json();
};

export {
    fetchAllParticipants,
    fetchParticipantById,
    fetchParticipantByName,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    addDiscipline,
    removeDiscipline,
};