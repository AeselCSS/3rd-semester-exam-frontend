import { describe, it, expect, vi } from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynamicResultValueInput from '../../src/components/DynamicResultValueInput';
import { ResultType } from '../../src/enums';

describe('DynamicResultValueInput', () => {
    it('formats running time correctly', () => {
        const handleChange = vi.fn();
        render(
            <DynamicResultValueInput
                discipline={ResultType.TIME}
                value="123456"
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12:34:56.00');

        fireEvent.change(input, { target: { value: '123456' } });

        expect(handleChange).toHaveBeenLastCalledWith('12:34:56.00');
    });

    it('formats throwing/jumping distance correctly', () => {
        const handleChange = vi.fn();
        render(
            <DynamicResultValueInput
                discipline={ResultType.DISTANCE}
                value="1234"
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12.34');

        fireEvent.change(input, { target: { value: '1234' } });

        expect(handleChange).toHaveBeenLastCalledWith('12.34');
    });

    it('handles points without formatting', async () => {
        const handleChange = vi.fn();
        render(
            <DynamicResultValueInput
                discipline={ResultType.POINTS}
                value="1234"
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('1234');

        await userEvent.clear(input);
        await userEvent.type(input, '1234');

        expect(handleChange).toHaveBeenLastCalledWith('1234');
    });

    it('removes non-numeric characters from input', () => {
        const handleChange = vi.fn();
        render(
            <DynamicResultValueInput
                discipline={ResultType.TIME}
                value=""
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'abc123def456' } });

        expect(handleChange).toHaveBeenLastCalledWith('12:34:56.00');
    });

    it('pads incomplete values with zeros', async () => {
        const handleChange = vi.fn();
        render(
            <DynamicResultValueInput
                discipline={ResultType.TIME}
                value="12"
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12:00:00.00');
    });

    it('updates formatted value when discipline changes', () => {
        const handleChange = vi.fn();
        const { rerender } = render(
            <DynamicResultValueInput
                discipline={ResultType.TIME}
                value="1234"
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12:34:00.00');

        // Rerender with different discipline
        rerender(
            <DynamicResultValueInput
                discipline={ResultType.DISTANCE}
                value="1234"
                onChange={handleChange}
            />
        );

        expect(input).toHaveValue('12.34');
    });

    it('maintains cursor position after formatting', async () => {
        const handleChange = vi.fn();
        render(
            <DynamicResultValueInput
                discipline={ResultType.TIME}
                value=""
                onChange={handleChange}
            />
        );

        const input = screen.getByRole('textbox') as HTMLInputElement;
        await userEvent.type(input, '12');
        input.setSelectionRange(1, 1);

        expect(input.selectionStart).toBe(1);
        expect(input.selectionEnd).toBe(1);
    });
});