import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// Mock components
vi.mock('../containers', () => ({
    __esModule: true,
    PageNotFound: () => <div>Page Not Found</div>,
    Results: () => <div>Results Page <button>Add Result</button><button>Add Multiple Results</button></div>,
    Participants: () => <div>Participants Page <button>Add Participant</button></div>,
    Home: () => <div>Home Page</div>,
}));

vi.mock('../components/ParticipantFilter', () => ({
    __esModule: true,
    default: () => <input placeholder="Search participants" />,
}));

vi.mock('../components/ResultFilter', () => ({
    __esModule: true,
    default: () => <input placeholder="Search results" />,
}));

describe('AppRoutes', () => {
    describe('Page rendering', () => {
        it('renders Home component for "/" route', () => {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <AppRoutes />
                </MemoryRouter>
            );

            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });

        it('renders Participants component for "/participants" route', () => {
            render(
                <MemoryRouter initialEntries={['/participants']}>
                    <AppRoutes />
                </MemoryRouter>
            );

            expect(screen.getByText('Participants Page')).toBeInTheDocument();
        });

        it('renders Results component for "/results" route', () => {
            render(
                <MemoryRouter initialEntries={['/results']}>
                    <AppRoutes />
                </MemoryRouter>
            );

            expect(screen.getByText('Results Page')).toBeInTheDocument();
        });

        it('renders PageNotFound component for unknown route', () => {
            render(
                <MemoryRouter initialEntries={['/unknown']}>
                    <AppRoutes />
                </MemoryRouter>
            );

            expect(screen.getByText('Page Not Found')).toBeInTheDocument();
        });
    });
});