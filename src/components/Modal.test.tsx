import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
    it('renders children content', () => {
        render(
            <Modal>
                <div data-testid="modal-content">Test Content</div>
            </Modal>
        );

        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('has correct structure with overlay and content container', () => {
        render(
            <Modal>
                <div>Content</div>
            </Modal>
        );

        // Main container
        const container = screen.getByText('Content').closest('.fixed');
        expect(container).toHaveClass('fixed inset-0 flex items-center justify-center');

        // Overlay (backdrop)
        const overlay = container?.querySelector('.bg-black');
        expect(overlay).toHaveClass('bg-opacity-50 absolute inset-0 backdrop-blur-md');

        // Content wrapper
        const contentWrapper = screen.getByText('Content').parentElement;
        expect(contentWrapper).toHaveClass('bg-white p-8 rounded-md relative z-10');
    });

    it('applies overflow styling to content wrapper', () => {
        render(
            <Modal>
                <div>Scrollable Content</div>
            </Modal>
        );

        const contentWrapper = screen.getByText('Scrollable Content').parentElement;
        expect(contentWrapper).toHaveClass('max-h-[800px] overflow-y-auto overscroll-none');
    });

    it('maintains minimum width on content wrapper', () => {
        render(
            <Modal>
                <div>Content</div>
            </Modal>
        );

        const contentWrapper = screen.getByText('Content').parentElement;
        expect(contentWrapper).toHaveClass('min-w-96');
    });

    it('renders multiple children', () => {
        render(
            <Modal>
                <div>First Child</div>
                <div>Second Child</div>
                <div>Third Child</div>
            </Modal>
        );

        expect(screen.getByText('First Child')).toBeInTheDocument();
        expect(screen.getByText('Second Child')).toBeInTheDocument();
        expect(screen.getByText('Third Child')).toBeInTheDocument();
    });
});