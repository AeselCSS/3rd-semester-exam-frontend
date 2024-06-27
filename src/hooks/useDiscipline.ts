import { DisciplineResponseDTO } from "../shared.types";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDisciplines, fetchDisciplineById, fetchDisciplineByName } from "../services/disciplineService";
import {queryConfig} from "../config/queryConfig.ts";

const useDiscipline = () => {
    const useDisciplinesQuery = () => useQuery<DisciplineResponseDTO[], Error>({
        queryKey: ["disciplines"],
        queryFn: fetchAllDisciplines,  ...queryConfig.longLivedData
    });

    const useDisciplineByIdQuery = (id: number) => useQuery<DisciplineResponseDTO, Error>({
        queryKey: ["discipline", id],
        queryFn: () => fetchDisciplineById(id), ...queryConfig.mediumLivedData
    });

    const useDisciplineByNameQuery = (name: string) => useQuery<DisciplineResponseDTO, Error>({
        queryKey: ["discipline", name],
        queryFn: () => fetchDisciplineByName(name), ...queryConfig.mediumLivedData
    });

    return {
        useDisciplinesQuery,
        useDisciplineByIdQuery,
        useDisciplineByNameQuery,
    };
};

export default useDiscipline;
