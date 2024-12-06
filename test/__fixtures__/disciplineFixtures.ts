// test/__fixtures__/disciplineFixtures.ts
import { DisciplineResponseDTO } from '../../src/shared.types';
import { DisciplineType, ResultType } from '../../src/enums';

export const sampleDiscipline: DisciplineResponseDTO = {
    id: 1,
    name: '100m Sprint',
    disciplineType: DisciplineType.RUNNING,
    resultType: ResultType.TIME,
    participants: ['John Doe', 'Jane Doe']
};

export const sampleDisciplines: DisciplineResponseDTO[] = [
    sampleDiscipline,
    {
        id: 2,
        name: 'Long Jump',
        disciplineType: DisciplineType.JUMPING,
        resultType: ResultType.DISTANCE,
        participants: ['John Doe']
    }
];