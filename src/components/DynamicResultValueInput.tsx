import { ChangeEvent, useEffect, useState, useRef } from "react";
import { ResultType } from "../enums.ts";

const formatRunning = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, '').padEnd(8, '0');
    return `${numericValue.slice(0, 2)}:${numericValue.slice(2, 4)}:${numericValue.slice(4, 6)}.${numericValue.slice(6, 8)}`;
};

const formatThrowingAndJumping = (value: string): string => {
    const numericValue = value.replace(/[^0-9]/g, '').padEnd(4, '0');
    return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 4)}`;
};

const formatCombinedEvents = (value: string): string => {
    return value;
};

interface DynamicResultValueInputProps {
    discipline: string;
    value: string;
    onChange: (value: string) => void;
}

const DynamicResultValueInput = ({ discipline, value, onChange }: DynamicResultValueInputProps) => {
    const [formattedValue, setFormattedValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let formatted;
        switch (discipline) {
            case ResultType.TIME:
                formatted = formatRunning(value);
                break;
            case ResultType.DISTANCE:
                formatted = formatThrowingAndJumping(value);
                break;
            case ResultType.POINTS:
                formatted = formatCombinedEvents(value);
                break;
            default:
                formatted = value;
        }
        setFormattedValue(formatted);
    }, [discipline, value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let formatted;
        switch (discipline) {
            case ResultType.TIME:
                formatted = formatRunning(rawValue);
                break;
            case ResultType.DISTANCE:
                formatted = formatThrowingAndJumping(rawValue);
                break;
            case ResultType.POINTS:
                formatted = formatCombinedEvents(rawValue);
                break;
            default:
                formatted = rawValue;
        }

        const cursorPosition = e.target.selectionStart || 0;

        setFormattedValue(formatted);
        onChange(formatted);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        }, 0);
    };

    return (
        <input
            type="text"
            value={formattedValue}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            ref={inputRef}
        />
    );
};

export default DynamicResultValueInput;
