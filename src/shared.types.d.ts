import { DisciplineType, AgeGroup, Gender, ResultType } from "./enums";

export interface ParticipantRequestDTO {
    id: number | null;
    fullName: string;
    gender: Gender;
    dateOfBirth: string; // Using string to represent LocalDate
    club: string;
    disciplines: string[];
}

export interface ParticipantResponseDTO {
    id: number;
    fullName: string;
    gender: Gender;
    age: number;
    ageGroup: AgeGroup;
    club: string;
    disciplines: string[];
}

export interface ResultRequestDTO {
    participantId: number;
    disciplineId: number;
    resultType: ResultType;
    date: string; // Using string to represent LocalDate
    resultValue: string;
}

export interface ResultResponseDTO {
    id: number;
    resultType: ResultType;
    date: string; // Using string to represent LocalDate
    formattedValue: string;
    participantId: number;
    disciplineId: number;
    participantName: string;
    disciplineName: string;
}

export interface DisciplineRequestDTO {
    id: number | null;
    name: string;
    disciplineType: DisciplineType;
    resultType: ResultType;
}

export interface DisciplineResponseDTO {
    id: number;
    name: string;
    disciplineType: DisciplineType;
    resultType: ResultType;
}
