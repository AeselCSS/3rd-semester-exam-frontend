import { describe, it, expect } from "vitest";
import formatEnum from "./formatEnum";

describe("formatEnum", () => {
    it("should format an enum value with underscores to a title-cased string", () => {
        const result = formatEnum("TEST_ENUM_VALUE");
        expect(result).toBe("Test Enum Value");
    });

    it("should handle a single word correctly", () => {
        const result = formatEnum("SINGLE");
        expect(result).toBe("Single");
    });

    it("should handle already formatted values correctly", () => {
        const result = formatEnum("Already Formatted");
        expect(result).toBe("Already Formatted");
    });

    it("should handle empty strings correctly", () => {
        const result = formatEnum("");
        expect(result).toBe("");
    });

    it("should handle values with mixed casing and underscores", () => {
        const result = formatEnum("MiXeD_CaSe_ValUE");
        expect(result).toBe("Mixed Case Value");
    });

    it("should handle values with multiple underscores correctly", () => {
        const result = formatEnum("MULTIPLE__UNDERSCORES");
        expect(result).toBe("Multiple  Underscores"); // Keeps double spaces if present in the input
    });
});
