import { describe, it, expect } from "vitest";
import cleanFilters from "../../../src/utils/cleanFilters";

describe("cleanFilters", () => {
    it("should remove keys with undefined values", () => {
        const filters = { key1: "value1", key2: undefined, key3: "value3" };
        const result = cleanFilters(filters);
        expect(result).toEqual({ key1: "value1", key3: "value3" });
    });

    it("should remove keys with empty string values", () => {
        const filters = { key1: "value1", key2: "", key3: "value3" };
        const result = cleanFilters(filters);
        expect(result).toEqual({ key1: "value1", key3: "value3" });
    });

    it("should keep keys with valid values", () => {
        const filters = { key1: "value1", key2: 42, key3: true, key4: null };
        const result = cleanFilters(filters);
        expect(result).toEqual({ key1: "value1", key2: 42, key3: true, key4: null });
    });

    it("should handle an empty object", () => {
        const filters = {};
        const result = cleanFilters(filters);
        expect(result).toEqual({});
    });

    it("should handle an object with only undefined and empty string values", () => {
        const filters = { key1: undefined, key2: "" };
        const result = cleanFilters(filters);
        expect(result).toEqual({});
    });

    it("should handle an object with mixed value types", () => {
        const filters = {
            key1: "value1",
            key2: "",
            key3: undefined,
            key4: 123,
            key5: false,
            key6: null,
        };
        const result = cleanFilters(filters);
        expect(result).toEqual({ key1: "value1", key4: 123, key5: false, key6: null });
    });
});
