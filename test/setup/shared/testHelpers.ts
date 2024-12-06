import { vi } from 'vitest';

// Common helper to mock toast notifications
const mockToast = () => {
    const toastMock = {
        error: vi.fn(),
        success: vi.fn(),
        loading: vi.fn()
    };

    vi.mock('react-hot-toast', () => ({
        default: toastMock
    }));

    // Clear mock history before returning
    vi.clearAllMocks();

    return toastMock;
};

// Helper for async operations in tests
const waitForLoadingToFinish = () =>
    new Promise((resolve) => setTimeout(resolve, 0));

// Common date for testing
const TEST_DATE = '2024-03-15T12:00:00Z';

export { TEST_DATE, waitForLoadingToFinish, mockToast };
