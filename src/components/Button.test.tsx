import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';


describe('Button', () => {
    it('renders with default primary variant', () => {
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
        render(<Button label="Danger" variant="danger" />);
        const button = screen.getByRole('button', { name: 'Danger' });
        expect(button).toHaveClass('bg-red-500');
    });

    it('renders with cancel variant', () => {
        render(<Button label="Cancel" variant="cancel" />);
        const button = screen.getByRole('button', { name: 'Cancel' });
        expect(button).toHaveClass('bg-slate-100');
    });

    it('renders with close variant', () => {
        render(<Button label="Close" variant="close" />);
        const button = screen.getByRole('button', { name: 'Close' });
        expect(button).toHaveClass('bg-slate-100');
    });

    it('accepts and renders additional className', () => {
        render(<Button label="Custom" className="custom-class" />);
        const button = screen.getByRole('button', { name: 'Custom' });
        expect(button).toHaveClass('custom-class');
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        render(<Button label="Click me" onClick={handleClick} />);

        const button = screen.getByRole('button', { name: 'Click me' });
        await userEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders with ReactNode label', () => {
        render(
            <Button
                label={<span data-testid="custom-label">Custom Label</span>}
        />
    );
        expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    });

        it('should be disabled when disabled prop is true', () => {
            render(<Button label="Disabled" disabled />);
            const button = screen.getByRole('button', { name: 'Disabled' });
            expect(button).toBeDisabled();
        });
    });