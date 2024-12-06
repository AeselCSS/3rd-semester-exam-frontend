import { describe, it, expect } from "vitest";
import formatDate from "../../../src/utils/formatDate";

describe("formatDate", () => {
    it("should format a valid ISO date string correctly", () => {
        const result = formatDate("2024-12-06T00:00:00.000Z");
        expect(result).toBe("6. dec. 2024"); // Danish medium date format
    });

    it("should handle a date string without a time part", () => {
        const result = formatDate("2024-12-06");
        expect(result).toBe("6. dec. 2024");
    });

    it("should handle invalid date strings gracefully", () => {
        expect(() => formatDate("invalid-date")).toThrowError("Invalid time value");
    });

    it("should handle edge case dates (e.g., leap year)", () => {
        const result = formatDate("2024-02-29");
        expect(result).toBe("29. feb. 2024");
    });

    it("should format a historical date correctly", () => {
        const result = formatDate("1900-01-01");
        expect(result).toBe("1. jan. 1900");
    });

    it("should handle a future date correctly", () => {
        const result = formatDate("2100-12-31");
        expect(result).toBe("31. dec. 2100");
    });
});
