import { describe, it, expect } from "vitest";
import { formatValue, parseFormattedValue } from "../../../src/utils/resultUtils"
import { ResultType } from "../../../src/enums";

describe("formatValue", () => {
    it("should format TIME correctly", () => {
        const result = formatValue(ResultType.TIME, 732051); // e.g., 2 hours, 2 minutes, 3 seconds, 51 hundredths
        expect(result).toBe("02:02:00.51");
    });

    it("should format DISTANCE correctly", () => {
        const result = formatValue(ResultType.DISTANCE, 150); // 1 meter, 50 centimeters
        expect(result).toBe("1.50");
    });

    it("should format POINTS correctly", () => {
        const result = formatValue(ResultType.POINTS, 12345);
        expect(result).toBe("12345");
    });

    it("should throw an error for null ResultType", () => {
        expect(() => formatValue(null as never, 123)).toThrow("Result type cannot be null");
    });

    it("should throw an error for invalid ResultType", () => {
        expect(() => formatValue(999 as never, 123)).toThrow("Invalid result type: 999");
    });
});

describe("parseFormattedValue", () => {
    it("should parse TIME correctly", () => {
        const result = parseFormattedValue(ResultType.TIME, "02:02:03.51");
        expect(result).toBe(732051); // 2 hours, 2 minutes, 3 seconds, 51 hundredths
    });

    it("should parse DISTANCE correctly", () => {
        const result = parseFormattedValue(ResultType.DISTANCE, "1.50");
        expect(result).toBe(150); // 1 meter, 50 centimeters
    });

    it("should parse POINTS correctly", () => {
        const result = parseFormattedValue(ResultType.POINTS, "12345");
        expect(result).toBe(12345);
    });

    it("should throw an error for null ResultType", () => {
        expect(() => parseFormattedValue(null as never, "123")).toThrow("Result type cannot be null");
    });

    it("should throw an error for invalid ResultType", () => {
        expect(() => parseFormattedValue(999 as never, "123")).toThrow("Invalid result type: 999");
    });
});
