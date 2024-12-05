import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders without crashing', () => {
        render(<LoadingSpinner />);
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('has correct default dimensions', () => {
        render(<LoadingSpinner />);
        const svg = document.querySelector('svg');
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('contains four animated rectangles', () => {
        render(<LoadingSpinner />);
        const rects = document.querySelectorAll('rect');
        expect(rects).toHaveLength(4);
    });

    it('accepts and applies additional props', () => {
        render(<LoadingSpinner className="custom-class" data-testid="spinner" />);
        const svg = screen.getByTestId('spinner');
        expect(svg).toHaveClass('custom-class');
    });

    it('accepts custom dimensions', () => {
        render(<LoadingSpinner width={100} height={100} />);
        const svg = document.querySelector('svg');
        expect(svg).toHaveAttribute('width', '100');
        expect(svg).toHaveAttribute('height', '100');
    });

    it('preserves animation elements', () => {
        render(<LoadingSpinner />);
        const animations = document.querySelectorAll('animate');
        expect(animations.length).toBeGreaterThan(0);
    });

    it('maintains consistent fill color', () => {
        render(<LoadingSpinner />);
        const rects = document.querySelectorAll('rect');
        rects.forEach(rect => {
            expect(rect).toHaveAttribute('fill', '#333333');
        });
    });
});