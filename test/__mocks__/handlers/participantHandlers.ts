import { http, HttpResponse } from 'msw';
import { ParticipantRequestDTO } from '../../../src/shared.types';
import { mockParticipants } from '../../setup/shared/mockData';
import {AgeGroup, Gender} from "../../../src/enums";

export const participantHandlers = [
    // GET all participants with filters
    http.get('http://localhost:8080/participant', ({ request }) => {
        const url = new URL(request.url);
        const gender = url.searchParams.get('gender') as Gender;
        const ageGroup = url.searchParams.get('ageGroup') as AgeGroup;
        const club = url.searchParams.get('club');
        const discipline = url.searchParams.get('discipline');

        let filteredParticipants = [...mockParticipants];

        if (gender) {
            filteredParticipants = filteredParticipants.filter(p => p.gender === gender);
        }
        if (ageGroup) {
            filteredParticipants = filteredParticipants.filter(p => p.ageGroup === ageGroup);
        }
        if (club) {
            filteredParticipants = filteredParticipants.filter(p => p.club === club);
        }
        if (discipline) {
            filteredParticipants = filteredParticipants.filter(p => p.disciplines.includes(discipline));
        }

        return HttpResponse.json(filteredParticipants, { status: 200 });
    }),

    // GET participant by ID
    http.get('http://localhost:8080/participant/id/:id', ({ params }) => {
        const { id } = params;
        const participant = mockParticipants.find(p => p.id === Number(id));

        if (participant) {
            return HttpResponse.json(participant, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Participant not found' },
            { status: 404 }
        );
    }),

    // GET participant by name
    http.get('http://localhost:8080/participant/name/:name', ({ params }) => {
        const { name } = params;
        let participant;
        if (typeof name === "string") {
             participant = mockParticipants.find(
                p => p.fullName.toLowerCase() === decodeURIComponent(name).toLowerCase()
            );
        }

        if (participant) {
            return HttpResponse.json(participant, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Participant not found' },
            { status: 404 }
        );
    }),

    // POST create participant
    http.post('http://localhost:8080/participant', async ({ request }) => {
        const newParticipant = await request.json() as ParticipantRequestDTO;
        const response = {
            id: mockParticipants.length + 1,
            fullName: newParticipant.fullName,
            gender: newParticipant.gender,
            age: 25, // Mock age calculation
            ageGroup: newParticipant.club, // This should be calculated based on age
            club: newParticipant.club,
            disciplines: newParticipant.disciplines
        };

        return HttpResponse.json(response, { status: 201 });
    }),

    // PATCH update participant
    http.patch('http://localhost:8080/participant/:id', async ({ params, request }) => {
        const { id } = params;
        const updateData = await request.json() as Partial<ParticipantRequestDTO>;
        const existingParticipant = mockParticipants.find(p => p.id === Number(id));

        if (existingParticipant) {
            const updatedParticipant = {
                ...existingParticipant,
                ...updateData
            };
            return HttpResponse.json(updatedParticipant, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Participant not found' },
            { status: 404 }
        );
    }),

    // DELETE participant
    http.delete('http://localhost:8080/participant/:id', ({ params }) => {
        const { id } = params;
        const participantExists = mockParticipants.some(p => p.id === Number(id));

        if (participantExists) {
            return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json(
            { message: 'Participant not found' },
            { status: 404 }
        );
    }),

    // PATCH add discipline to participant
    http.patch('http://localhost:8080/participant/:id/addDiscipline', async ({ params, request }) => {
        const { id } = params;
        const discipline = await request.json() as { name: string };
        const existingParticipant = mockParticipants.find(p => p.id === Number(id));

        if (existingParticipant) {
            const updatedParticipant = {
                ...existingParticipant,
                disciplines: [...existingParticipant.disciplines, discipline.name]
            };
            return HttpResponse.json(updatedParticipant, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Participant not found' },
            { status: 404 }
        );
    }),

    // PATCH remove discipline from participant
    http.patch('http://localhost:8080/participant/:id/removeDiscipline', async ({ params, request }) => {
        const { id } = params;
        const discipline = await request.json() as { name: string };
        const existingParticipant = mockParticipants.find(p => p.id === Number(id));

        if (existingParticipant) {
            const updatedParticipant = {
                ...existingParticipant,
                disciplines: existingParticipant.disciplines.filter(d => d !== discipline.name)
            };
            return HttpResponse.json(updatedParticipant, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Participant not found' },
            { status: 404 }
        );
    })
];

export const participantErrorHandlers = [
    http.get('http://localhost:8080/participant', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch participants' },
            { status: 500 }
        );
    }),

    http.get('http://localhost:8080/participant/id/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch participant' },
            { status: 500 }
        );
    }),

    http.get('http://localhost:8080/participant/name/:name', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch participant' },
            { status: 500 }
        );
    }),

    http.post('http://localhost:8080/participant', () => {
        return HttpResponse.json(
            { message: 'Failed to create participant' },
            { status: 500 }
        );
    }),

    http.patch('http://localhost:8080/participant/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to update participant' },
            { status: 500 }
        );
    }),

    http.patch('http://localhost:8080/participant/:id/addDiscipline', () => {
        return HttpResponse.json(
            { message: 'Failed to add discipline to participant' },
            { status: 500 }
        );
    }),

    http.patch('http://localhost:8080/participant/:id/removeDiscipline', () => {
        return HttpResponse.json(
            { message: 'Failed to remove discipline from participant' },
            { status: 500 }
        );
    }),

    http.delete('http://localhost:8080/participant/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to delete participant' },
            { status: 500 }
        );
    })
];