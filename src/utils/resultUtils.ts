import { ResultType } from "../enums";

export const formatValue = (resultType: ResultType, resultValue: number): string => {
    if (resultType == null) {
        throw new Error("Result type cannot be null");
    }

    switch (resultType) {
        case ResultType.TIME:
            return formatTime(resultValue);
        case ResultType.DISTANCE:
            return formatDistance(resultValue);
        case ResultType.POINTS:
            return resultValue.toString();
        default:
            throw new Error(`Invalid result type: ${resultType}`);
    }
};

export const parseFormattedValue = (resultType: ResultType, formattedValue: string): number => {
    if (resultType == null) {
        throw new Error("Result type cannot be null");
    }

    switch (resultType) {
        case ResultType.TIME:
            return parseTime(formattedValue);
        case ResultType.DISTANCE:
            return parseDistance(formattedValue);
        case ResultType.POINTS:
            return parseInt(formattedValue, 10);
        default:
            throw new Error(`Invalid result type: ${resultType}`);
    }
};

const formatTime = (resultValue: number): string => {
    const hours = Math.floor(resultValue / 360000);
    const minutes = Math.floor((resultValue % 360000) / 6000);
    const seconds = Math.floor((resultValue % 6000) / 100);
    const hundredths = resultValue % 100;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(hundredths)}`;
};

const parseTime = (formattedValue: string): number => {
    const [hours, minutes, seconds, hundredths] = formattedValue.split(/[:.]/).map(Number);

    return ((hours * 3600 + minutes * 60 + seconds) * 100) + hundredths;
};

const formatDistance = (resultValue: number): string => {
    const meters = Math.floor(resultValue / 100);
    const centimeters = resultValue % 100;

    return `${meters}.${padZero(centimeters)}`;
};

const parseDistance = (formattedValue: string): number => {
    const [meters, centimeters] = formattedValue.split('.').map(Number);

    return (meters * 100) + centimeters;
};

const padZero = (num: number): string => num.toString().padStart(2, '0');
