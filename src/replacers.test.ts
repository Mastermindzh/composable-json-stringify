/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  symbolToString,
  bigIntToString,
  dateToISOString,
  undefinedToNull,
  functionToString,
  errorToObject,
  mapToObject,
  setToArray,
} from "./replacers";
import { JsValue } from "./index";

describe("Replacer functions", () => {
  describe("symbolToString", () => {
    it("should convert Symbol to string representation", () => {
      const sym = Symbol("test");
      expect(symbolToString("key", sym)).toBe(sym.toString());
    });

    it("should leave non-Symbol values unchanged", () => {
      expect(symbolToString("key", "test")).toBe("test");
      expect(symbolToString("key", 123)).toBe(123);
      expect(symbolToString("key", null)).toBe(null);
    });
  });

  describe("bigIntToString", () => {
    it("should convert BigInt to string representation", () => {
      const big = BigInt(9007199254740991);
      expect(bigIntToString("key", big)).toBe(big.toString());
    });

    it("should leave non-BigInt values unchanged", () => {
      expect(bigIntToString("key", "test")).toBe("test");
      expect(bigIntToString("key", 123)).toBe(123);
      expect(bigIntToString("key", null)).toBe(null);
    });
  });

  describe("dateToISOString", () => {
    it("should convert Date to ISO string", () => {
      const date = new Date("2023-01-01T00:00:00.000Z");
      expect(dateToISOString("key", date)).toBe(date.toISOString());
    });

    it("should leave non-Date values unchanged", () => {
      expect(dateToISOString("key", "test")).toBe("test");
      expect(dateToISOString("key", 123)).toBe(123);
      expect(dateToISOString("key", null)).toBe(null);
    });
  });

  describe("undefinedToNull", () => {
    it("should convert undefined to null", () => {
      expect(undefinedToNull("key", undefined)).toBe(null);
    });

    it("should leave non-undefined values unchanged", () => {
      expect(undefinedToNull("key", "test")).toBe("test");
      expect(undefinedToNull("key", 123)).toBe(123);
      expect(undefinedToNull("key", null)).toBe(null);
    });
  });

  describe("functionToString", () => {
    it('should convert function to "[Function]"', () => {
      const fn = () => "test";
      expect(functionToString("key", fn)).toBe("[Function]");
    });

    it("should leave non-function values unchanged", () => {
      expect(functionToString("key", "test")).toBe("test");
      expect(functionToString("key", 123)).toBe(123);
      expect(functionToString("key", null)).toBe(null);
    });
  });

  describe("errorToObject", () => {
    it("should convert Error to object with name, message, and stack", () => {
      const error = new Error("test error");
      const result = errorToObject("key", error) as Record<string, any>;

      expect(result).toHaveProperty("name", "Error");
      expect(result).toHaveProperty("message", "test error");
      expect(result).toHaveProperty("stack");
      expect(typeof result.stack).toBe("string");
    });

    it("should leave non-Error values unchanged", () => {
      expect(errorToObject("key", "test")).toBe("test");
      expect(errorToObject("key", 123)).toBe(123);
      expect(errorToObject("key", null)).toBe(null);
    });
  });

  describe("mapToObject", () => {
    it("should convert Map to object", () => {
      const map = new Map<string, JsValue>();
      map.set("a", 1);
      map.set("b", "test");
      map.set("c", true);

      const result = mapToObject("key", map) as Record<string, any>;

      expect(result).toEqual({
        a: 1,
        b: "test",
        c: true,
      });
    });

    it("should handle non-primitive values in maps", () => {
      const map = new Map<string, JsValue>();
      map.set("obj", { name: "test" });

      const result = mapToObject("key", map) as Record<string, any>;

      expect(result.obj).toBe(JSON.stringify({ name: "test" }));
    });

    it("should leave non-Map values unchanged", () => {
      expect(mapToObject("key", "test")).toBe("test");
      expect(mapToObject("key", 123)).toBe(123);
      expect(mapToObject("key", null)).toBe(null);
    });
  });

  describe("setToArray", () => {
    it("should convert Set to array", () => {
      const set = new Set<JsValue>([1, "test", true]);
      const result = setToArray("key", set) as any[];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain(1);
      expect(result).toContain("test");
      expect(result).toContain(true);
    });

    it("should handle non-primitive values in sets", () => {
      const set = new Set<JsValue>([{ name: "test" }]);
      const result = setToArray("key", set) as any[];

      expect(result[0]).toBe(JSON.stringify({ name: "test" }));
    });

    it("should leave non-Set values unchanged", () => {
      expect(setToArray("key", "test")).toBe("test");
      expect(setToArray("key", 123)).toBe(123);
      expect(setToArray("key", null)).toBe(null);
    });
  });
});
