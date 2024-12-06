import { http, HttpResponse } from 'msw';
import { mockDisciplines } from '../../setup/shared/mockData';

export const disciplineHandlers = [
    // GET all disciplines
    http.get('http://localhost:8080/discipline', () => {
        return HttpResponse.json(mockDisciplines, { status: 200 });
    }),

    // GET discipline by ID
    http.get('http://localhost:8080/discipline/:id', ({ params }) => {
        const { id } = params;
        const discipline = mockDisciplines.find(d => d.id === Number(id));

        if (discipline) {
            return HttpResponse.json(discipline, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Discipline not found' },
            { status: 404 }
        );
    }),

    // GET discipline by name
    http.get('http://localhost:8080/discipline/name/:name', ({ params }) => {
        const { name } = params;
        let discipline;
        if (typeof name === "string") {
            discipline = mockDisciplines.find(
                d => d.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
            );
        }

        if (discipline) {
            return HttpResponse.json(discipline, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Discipline not found' },
            { status: 404 }
        );
    })
];

export const disciplineErrorHandlers = [
    http.get('http://localhost:8080/discipline', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch disciplines' },
            { status: 500 }
        );
    }),

    http.get('http://localhost:8080/discipline/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch discipline' },
            { status: 500 }
        );
    }),

    http.get('http://localhost:8080/discipline/name/:name', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch discipline' },
            { status: 500 }
        );
    })
];