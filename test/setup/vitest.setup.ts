
import { fetch, Request, Response } from 'cross-fetch';
import '@testing-library/jest-dom';  // Change this import

// Add fetch to global scope
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

// Add custom error handling for tests
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