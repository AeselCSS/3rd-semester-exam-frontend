// test/setup/shared/mockData.ts
import {Gender, AgeGroup, DisciplineType, ResultType} from '../../../src/enums';
import {DisciplineResponseDTO, ParticipantResponseDTO, ResultResponseDTO} from "../../../src/shared.types";

const mockParticipants: ParticipantResponseDTO[] = [
    {
        id: 1,
        fullName: 'John Doe',
        gender: Gender.MALE,
        age: 25,
        ageGroup: AgeGroup.SENIOR,
        club: 'Athletic Club',
        disciplines: ['100m Sprint']
    },
    {
        id: 2,
        fullName: 'Jane Doe',
        gender: Gender.FEMALE,
        age: 22,
        ageGroup: AgeGroup.SENIOR,
        club: 'Athletic Club',
        disciplines: ['Long Jump']
    }
];

const mockDisciplines: DisciplineResponseDTO[] = [
    {
        id: 1,
        name: '100m Sprint',
        disciplineType: DisciplineType.RUNNING,
        resultType: ResultType.TIME,
        participants: ['John Doe']
    },
    {
        id: 2,
        name: 'Long Jump',
        disciplineType: DisciplineType.JUMPING,
        resultType: ResultType.DISTANCE,
        participants: ['Jane Doe']
    }
];

const mockResults: ResultResponseDTO[] = [
    {
        id: 1,
        resultType: ResultType.TIME,
        date: '2024-03-15',
        formattedValue: '10.5s',
        participantId: 1,
        disciplineId: 1,
        participantName: 'John Doe',
        disciplineName: '100m Sprint'
    },
    {
        id: 2,
        resultType: ResultType.DISTANCE,
        date: '2024-03-15',
        formattedValue: '7.5m',
        participantId: 2,
        disciplineId: 2,
        participantName: 'Jane Doe',
        disciplineName: 'Long Jump'
    }
];

const mockSearchParams = {
    disciplineName: '100m Sprint',
    gender: Gender.MALE,
    ageGroup: AgeGroup.SENIOR
};

const mockQueryString = 'disciplineName=100m+Sprint&gender=MALE&ageGroup=SENIOR';


export {mockParticipants, mockDisciplines, mockResults, mockSearchParams, mockQueryString};