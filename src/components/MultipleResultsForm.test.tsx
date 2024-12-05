import {beforeEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import MultipleResultsForm from './MultipleResultsForm';
import {ResultType} from '../enums';

// Mock the custom hooks
vi.mock('../hooks/useResult', () => ({
    default: () => ({
        useCreateResultsBatchMutation: () => ({
            mutate: vi.fn(),
        }),
    }),
}));

vi.mock('../hooks/useParticipant', () => ({
    default: () => ({
        useParticipantsQuery: () => ({
            data: [
                { id: 1, fullName: 'John Doe' },
                { id: 2, fullName: 'Jane Smith' },
            ],
        }),
    }),
}));

vi.mock('../hooks/useDiscipline', () => ({
    default: () => ({
        useDisciplinesQuery: () => ({
            data: [
                {
                    id: 1,
                    name: '100m',
                    resultType: ResultType.TIME,
                    participants: ['John Doe', 'Jane Smith']
                },
                {
                    id: 2,
                    name: 'Long Jump',
                    resultType: ResultType.DISTANCE,
                    participants: ['John Doe']
                },
            ],
        }),
    }),
}));

describe('MultipleResultsForm', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form elements correctly', () => {
        render(<MultipleResultsForm onClose={onClose} />);

        expect(screen.getByLabelText(/discipline/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/participants/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('populates disciplines dropdown', () => {
        render(<MultipleResultsForm onClose={onClose} />);

        const disciplineSelect = screen.getByLabelText(/discipline/i);
        expect(disciplineSelect).toHaveDisplayValue(['Select a discipline']);
        expect(screen.getByText('100m')).toBeInTheDocument();
        expect(screen.getByText('Long Jump')).toBeInTheDocument();
    });

    it('updates participants list when discipline is selected', async () => {
        render(<MultipleResultsForm onClose={onClose} />);

        const disciplineSelect = screen.getByLabelText(/discipline/i);
        fireEvent.change(disciplineSelect, { target: { value: '1' } });

        const participantsSelect = screen.getByLabelText(/participants/i);
        expect(participantsSelect).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('handles participant selection', () => {
        render(<MultipleResultsForm onClose={onClose} />);

        // Select discipline first
        fireEvent.change(screen.getByLabelText(/discipline/i), { target: { value: '1' } });

        // Simpler event for multi-select
        const participantsSelect = screen.getByLabelText(/participants/i) as HTMLSelectElement;
        fireEvent.change(participantsSelect, {
            target: {
                multiple: true,
                value: '1',
            }
        });

        expect(screen.getByText(/Result for John Doe/)).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        render(<MultipleResultsForm onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('validates required fields before submission', async () => {
        render(<MultipleResultsForm onClose={onClose} />);

        const submitButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(submitButton);

        // Check that the form wasn't submitted (you might want to add specific error handling/messages)
        expect(screen.getByLabelText(/discipline/i)).toBeInvalid();
        expect(screen.getByLabelText(/date/i)).toBeInvalid();
    });

    describe('format hints', () => {
        beforeEach(() => {
            render(<MultipleResultsForm onClose={onClose} />);
        });

        it('shows time format for running events', async () => {
            // Select discipline first
            const disciplineSelect = screen.getByLabelText('Discipline');
            fireEvent.change(disciplineSelect, { target: { value: '1' } });

            // Select participant using native select methods
            const participantSelect = screen.getByLabelText('Participants') as HTMLSelectElement;
            const option = Array.from(participantSelect.options).find(opt => opt.value === '1');
            if (option) {
                option.selected = true;
                fireEvent.change(participantSelect);
            }

            // Give React time to update state and render
            await vi.dynamicImportSettled();

            // Look for the format hint text
            const formatText = await screen.findByText(text => {
                return text.toLowerCase().includes('hh:mm:ss');
            }, { exact: false });

            expect(formatText).toBeInTheDocument();
        });

        it('shows distance format for field events', async () => {
            // Select discipline
            const disciplineSelect = screen.getByLabelText('Discipline');
            fireEvent.change(disciplineSelect, { target: { value: '2' } });

            // Select participant using native select methods
            const participantSelect = screen.getByLabelText('Participants') as HTMLSelectElement;
            const option = Array.from(participantSelect.options).find(opt => opt.value === '1');
            if (option) {
                option.selected = true;
                fireEvent.change(participantSelect);
            }

            // Give React time to update state and render
            await vi.dynamicImportSettled();

            // Look for the format hint text
            const formatText = await screen.findByText(text => {
                return text.toLowerCase().includes('m.cc');
            }, { exact: false });

            expect(formatText).toBeInTheDocument();
        });
    });
});