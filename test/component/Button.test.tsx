import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../setup/test-utils';
import Button from '../../src/components/Button';

describe('Button Component', () => {
    it('renders with default (primary) variant', () => {
        render(<Button label="Click me" />);

        const button = screen.getByRole('button', { name: 'Click me' });

        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-slate-600');
    });

    it('renders with secondary variant', () => {
        render(<Button label="Secondary" variant="secondary" />);

        const button = screen.getByRole('button', { name: 'Secondary' });

        expect(button).toHaveClass('bg-slate-300');
    });

    it('renders with danger variant', () => {
        render(<Button label="Delete" variant="danger" />);

        const button = screen.getByRole('button', { name: 'Delete' });

        expect(button).toHaveClass('bg-red-500');
    });

    it('renders with cancel variant', () => {
        render(<Button label="Cancel" variant="cancel" />);

        const button = screen.getByRole('button', { name: 'Cancel' });

        expect(button).toHaveClass('bg-slate-100');
        expect(button).toHaveClass('border-slate-200');
    });

    it('renders with close variant', () => {
        render(<Button label="Close" variant="close" />);

        const button = screen.getByRole('button', { name: 'Close' });

        expect(button).toHaveClass('bg-slate-100');
        expect(button).toHaveClass('border-slate-200');
    });

    it('applies custom className alongside variant styles', () => {
        render(
            <Button
                label="Custom"
                variant="primary"
                className="mt-4 w-full"
            />
        );

        const button = screen.getByRole('button', { name: 'Custom' });

        expect(button).toHaveClass('bg-slate-600', 'mt-4', 'w-full');
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        const { user } = render(
            <Button
                label="Click me"
                onClick={handleClick}
            />
        );

        const button = screen.getByRole('button', { name: 'Click me' });
        await user.click(button);

        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('renders with ReactNode label', () => {
        render(
            <Button
                label={<span data-testid="custom-label">Custom Label</span>}
            />
        );

        expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    });

    it('properly handles disabled state', () => {
        render(<Button label="Disabled" disabled />);

        const button = screen.getByRole('button', { name: 'Disabled' });

        expect(button).toBeDisabled();
    });
});