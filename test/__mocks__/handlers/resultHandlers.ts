import { http, HttpResponse } from 'msw';
import { ResultRequestDTO } from '../../../src/shared.types';
import { Gender, AgeGroup } from '../../../src/enums';
import {mockResults, mockParticipants, mockDisciplines} from '../../setup/shared/mockData';

export const resultHandlers = [
    // GET Results with filters
    http.get('http://localhost:8080/results', ({ request }) => {
        const url = new URL(request.url);
        const disciplineName = url.searchParams.get('disciplineName');
        const gender = url.searchParams.get('gender') as Gender;
        const ageGroup = url.searchParams.get('ageGroup') as AgeGroup;

        let filteredResults = [...mockResults];

        if (disciplineName) {
            filteredResults = filteredResults.filter(r => r.disciplineName === disciplineName);
        }

        if (gender) {
            filteredResults = filteredResults.filter(result => {
                const participant = mockParticipants.find(p => p.id === result.participantId);
                return participant?.gender === gender;
            });
        }

        if (ageGroup) {
            filteredResults = filteredResults.filter(result => {
                const participant = mockParticipants.find(p => p.id === result.participantId);
                return participant?.ageGroup === ageGroup;
            });
        }

        return HttpResponse.json(filteredResults, { status: 200 });
    }),

    // GET Result by ID
    http.get('http://localhost:8080/results/:id', ({ params }) => {
        const { id } = params;
        const result = mockResults.find(r => r.id === Number(id));

        if (result) {
            return HttpResponse.json(result, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Result not found' },
            { status: 404 }
        );
    }),

    // POST Create Result
    http.post('http://localhost:8080/results', async ({ request }) => {
        const newResult = await request.json() as ResultRequestDTO;
        const response = {
            id: mockResults.length + 1,
            resultType: newResult.resultType,
            date: newResult.date,
            formattedValue: newResult.resultValue,
            participantId: newResult.participantId,
            disciplineId: newResult.disciplineId,
            participantName: mockParticipants.find(p => p.id === newResult.participantId)?.fullName || 'Unknown',
            disciplineName: mockDisciplines.find(d => d.id === newResult.disciplineId)?.name || 'Unknown'
        };

        return HttpResponse.json(response, { status: 201 });
    }),

    // POST Batch Results
    http.post('http://localhost:8080/results/batch', async ({ request }) => {
        const newResults = await request.json() as ResultRequestDTO[];
        const responses = newResults.map((result, index) => ({
            id: mockResults.length + index + 1,
            resultType: result.resultType,
            date: result.date,
            formattedValue: result.resultValue,
            participantId: result.participantId,
            disciplineId: result.disciplineId,
            participantName: mockParticipants.find(p => p.id === result.participantId)?.fullName || 'Unknown',
            disciplineName: mockDisciplines.find(d => d.id === result.disciplineId)?.name || 'Unknown'
        }));

        return HttpResponse.json(responses, { status: 201 });
    }),

    // PUT Update Result
    http.put('http://localhost:8080/results/:id', async ({ params, request }) => {
        const { id } = params;
        const updateData = await request.json() as ResultRequestDTO;
        const existingResult = mockResults.find(r => r.id === Number(id));

        if (existingResult) {
            const updatedResult = {
                ...existingResult,
                resultType: updateData.resultType,
                date: updateData.date,
                formattedValue: updateData.resultValue,
            };
            return HttpResponse.json(updatedResult, { status: 200 });
        }
        return HttpResponse.json(
            { message: 'Result not found' },
            { status: 404 }
        );
    }),

    // DELETE Result
    http.delete('http://localhost:8080/results/:id', ({ params }) => {
        const { id } = params;
        const resultExists = mockResults.some(r => r.id === Number(id));

        if (resultExists) {
            return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json(
            { message: 'Result not found' },
            { status: 404 }
        );
    })
];

// Add error handlers
export const resultErrorHandlers = [
    http.get('http://localhost:8080/results', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch results' },
            { status: 500 }
        );
    }),

    http.get('http://localhost:8080/results/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to fetch result' },
            { status: 500 }
        );
    }),

    http.post('http://localhost:8080/results', () => {
        return HttpResponse.json(
            { message: 'Failed to create result' },
            { status: 500 }
        );
    }),

    http.post('http://localhost:8080/results/batch', () => {
        return HttpResponse.json(
            { message: 'Failed to create results' },
            { status: 500 }
        );
    }),

    http.put('http://localhost:8080/results/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to update result' },
            { status: 500 }
        );
    }),

    http.delete('http://localhost:8080/results/:id', () => {
        return HttpResponse.json(
            { message: 'Failed to delete result' },
            { status: 500 }
        );
    })
];