import { DisciplineResponseDTO } from "../shared.types";
import { useQuery } from "@tanstack/react-query";
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

const useDiscipline = () => {
    const useDisciplinesQuery = () => useQuery<DisciplineResponseDTO[], Error>({
        queryKey: ["disciplines"],
        queryFn: fetchAllDisciplines,
    });

    const useDisciplineByIdQuery = (id: number) => useQuery<DisciplineResponseDTO, Error>({
        queryKey: ["discipline", id],
        queryFn: () => fetchDisciplineById(id),
    });

    const useDisciplineByNameQuery = (name: string) => useQuery<DisciplineResponseDTO, Error>({
        queryKey: ["discipline", name],
        queryFn: () => fetchDisciplineByName(name),
    });

    return {
        useDisciplinesQuery,
        useDisciplineByIdQuery,
        useDisciplineByNameQuery,
    };
};

export default useDiscipline;
