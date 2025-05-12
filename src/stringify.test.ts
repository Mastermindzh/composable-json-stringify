import { stringify, combineReplacers, JsonValue, JsValue, ReplacerMixin } from "./index";
import { symbolToString, bigIntToString, functionToString, undefinedToNull } from "./replacers";

describe("stringify function", () => {
  // Basic JSON values tests
  describe("basic JSON values", () => {
    it("should stringify primitives correctly", () => {
      expect(stringify(42)).toBe("42");
      expect(stringify("hello")).toBe('"hello"');
      expect(stringify(true)).toBe("true");
      expect(stringify(null)).toBe("null");
    });
    it("should stringify objects correctly", () => {
      const obj = { name: "test", value: 123 };
      expect(stringify(obj)).toBe('{"name":"test","value":123}');
    });

    it("should stringify arrays correctly", () => {
      const arr = [1, "two", true, null];
      expect(stringify(arr)).toBe('[1,"two",true,null]');
    });

    it("should stringify nested structures correctly", () => {
      const nested = {
        name: "parent",
        children: [
          { name: "child1", value: 1 },
          { name: "child2", value: 2 },
        ],
      };
      expect(stringify(nested)).toBe(
        '{"name":"parent","children":[{"name":"child1","value":1},{"name":"child2","value":2}]}',
      );
    });
  });

  // Space parameter tests
  describe("space parameter", () => {
    it("should format with numeric space parameter", () => {
      const obj = { a: 1, b: 2 };
      const expected = '{\n  "a": 1,\n  "b": 2\n}';
      expect(stringify(obj, null, 2)).toBe(expected);
    });

    it("should format with string space parameter", () => {
      const obj = { a: 1, b: 2 };
      const expected = '{\n--"a": 1,\n--"b": 2\n}';
      expect(stringify(obj, null, "--")).toBe(expected);
    });
  });

  // Standard replacer tests
  describe("standard replacer behavior", () => {
    it("should use replacer array of whitelisted properties", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(stringify(obj, ["a", "c"])).toBe('{"a":1,"c":3}');
    });

    it("should use replacer function", () => {
      const replacer: ReplacerMixin = (key: string, value: JsValue): JsonValue => {
        if (typeof value === "number") {
          return value * 2;
        }
        return value as JsonValue;
      };

      const obj = { a: 1, b: 2, c: "test" };
      expect(stringify(obj, replacer)).toBe('{"a":2,"b":4,"c":"test"}');
    });
  });

  // Custom replacer mixins tests
  describe("replacer mixins", () => {
    it("should apply a single replacer mixin", () => {
      const replacer = (key: string, value: JsValue): JsonValue => {
        if (typeof value === "string") {
          return value.toUpperCase();
        }
        return value as JsonValue;
      };

      const obj = { name: "test", value: 123 };
      expect(stringify(obj, replacer)).toBe('{"name":"TEST","value":123}');
    });

    it("should apply multiple replacer mixins in order", () => {
      // First replacer doubles all numbers
      const doubleNumbers = (key: string, value: JsValue): JsonValue => {
        if (typeof value === "number") {
          return value * 2;
        }
        return value as JsonValue;
      };

      // Second replacer uppercases all strings
      const uppercaseStrings = (key: string, value: JsValue): JsonValue => {
        if (typeof value === "string") {
          return value.toUpperCase();
        }
        return value as JsonValue;
      };

      const obj = { name: "test", value: 123 };
      expect(stringify(obj, [doubleNumbers, uppercaseStrings])).toBe('{"name":"TEST","value":246}');
    });
  });
});

describe("combineReplacers function", () => {
  it("should combine multiple replacers into a single replacer function", () => {
    // Create some test replacers
    const addPrefix = (key: string, value: JsValue): JsonValue => {
      if (typeof value === "string") {
        return `prefix_${value}`;
      }
      return value as JsonValue;
    };

    const addSuffix = (key: string, value: JsValue): JsonValue => {
      if (typeof value === "string") {
        return `${value}_suffix`;
      }
      return value as JsonValue;
    };

    // Combine the replacers
    const combined = combineReplacers([addPrefix, addSuffix]);

    // Test the combined replacer
    expect(combined("key", "test")).toBe("prefix_test_suffix");

    // Test with a non-string value to ensure it passes through unchanged
    expect(combined("key", 42)).toBe(42);
  });

  it("should work with imported replacers from replacers.ts", () => {
    const combined = combineReplacers([
      symbolToString,
      bigIntToString,
      functionToString,
      undefinedToNull,
    ]);

    // Test the combined replacer with different types
    const symbol = Symbol("test");
    expect(combined("key", symbol)).toBe(symbol.toString());

    const bigint = BigInt(123);
    expect(combined("key", bigint)).toBe(bigint.toString());

    const func = () => "test";
    expect(combined("key", func)).toBe("[Function]");

    expect(combined("key", undefined)).toBe(null);
  });
});
