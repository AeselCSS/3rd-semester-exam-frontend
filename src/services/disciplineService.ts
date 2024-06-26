import {DisciplineResponseDTO} from "../shared.types";
import toast from "react-hot-toast";

const fetchAllDisciplines = async (): Promise<DisciplineResponseDTO[]> => {
    const response = await fetch("http://localhost:8080/discipline");
    if (!response.ok) {
        toast.error("Failed to fetch disciplines");
        throw new Error("Failed to fetch disciplines");
    }
    return response.json();
};

const fetchDisciplineById = async (id: number): Promise<DisciplineResponseDTO> => {
    const response = await fetch(`http://localhost:8080/discipline/${id}`);
    if (!response.ok) {
        toast.error("Failed to fetch discipline by id");
        throw new Error("Failed to fetch discipline by id");
    }
    return response.json();
};

const fetchDisciplineByName = async (name: string): Promise<DisciplineResponseDTO> => {
    const response = await fetch(`http://localhost:8080/discipline/name/${name}`);
    if (!response.ok) {
        toast.error("Failed to fetch discipline by name");
        throw new Error("Failed to fetch discipline by name");
    }
    return response.json();
};

export {fetchAllDisciplines, fetchDisciplineById, fetchDisciplineByName};