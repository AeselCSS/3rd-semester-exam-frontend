import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../__mocks__/server';

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
    console.log('Handlers active:', server.listHandlers());
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
    console.log('Handlers active:', server.listHandlers());
});

afterAll(() => {
    server.close();
});