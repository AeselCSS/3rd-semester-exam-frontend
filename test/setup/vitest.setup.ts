import { fetch, Request, Response } from 'cross-fetch';
import { expect } from 'vitest';
import * as  matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect
expect.extend(matchers);

// Add fetch to global scope
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

// custom error handling for tests
window.addEventListener('error', (event) => {
    console.error('Browser error:', event.error);
});

// Mock resize observer
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;