import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../setup/test-utils';
import ParticipantDetails from '../../src/components/ParticipantDetails';
import { server } from '../__mocks__/server';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('ParticipantDetails', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        server.resetHandlers();
    });

    it('renders participant details correctly', async () => {
        render(<ParticipantDetails participantId={1} onClose={onClose} />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeDefined();
        });

        // Test that key information is displayed
        expect(screen.getByText('John Doe')).toBeDefined();
        expect(screen.getByText('Athletic Club')).toBeDefined();
        expect(screen.getByText('Male')).toBeDefined();
    });

    it('shows loading state initially', () => {
        render(<ParticipantDetails participantId={1} onClose={onClose} />);
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('handles remove discipline', async () => {
        const { user } = render(<ParticipantDetails participantId={1} onClose={onClose} />);

        // Wait for the participant data to load
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeDefined();
        });

        // Find all elements containing "100m Sprint"
        const disciplineItems = screen.getAllByText('100m Sprint');
        // Get the one in the list (should be the first one, not the one in the select)
        const disciplineListItem = disciplineItems.find(element =>
            element.closest('li')
        );

        if (!disciplineListItem) {
            throw new Error('Discipline list item not found');
        }

        // Find the delete button within the list item
        const deleteButton = disciplineListItem.parentElement?.querySelector('button');

        if (!deleteButton) {
            throw new Error('Delete button not found');
        }

        await user.click(deleteButton);

        // Verify the success toast
        expect(toast.success).toHaveBeenCalledWith('Discipline removed successfully');
    });

    it('handles add discipline', async () => {
        const { user } = render(<ParticipantDetails participantId={1} onClose={onClose} />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeDefined();
        });

        // Select discipline
        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'Long Jump');

        const addButton = screen.getByRole('button', { name: /add/i });
        await user.click(addButton);

        // Verify the success toast
        expect(toast.success).toHaveBeenCalledWith('Discipline added successfully');
    });

    it('handles delete participant', async () => {
        const { user } = render(<ParticipantDetails participantId={1} onClose={onClose} />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeDefined();
        });

        const deleteButton = screen.getByRole('button', { name: /delete participant/i });
        await user.click(deleteButton);

        // Verify the success toast and close callback
        expect(toast.success).toHaveBeenCalledWith('Participant deleted successfully');
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('closes when X button is clicked', async () => {
        const { user } = render(<ParticipantDetails participantId={1} onClose={onClose} />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeDefined();
        });

        const closeButton = screen.getByRole('button', { name: /x/i });
        await user.click(closeButton);

        expect(onClose).toHaveBeenCalledOnce();
    });
});