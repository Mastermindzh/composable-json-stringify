import { ReplacerMixin, JsValue, JsonValue, JsonObject } from "./stringify";

/**
 * Converts Symbol values to their string representation
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns The string representation of the Symbol or the original value
 */
export const symbolToString: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (typeof value === "symbol") {
    return value.toString();
  }
  return value as JsonValue;
};

/**
 * Converts BigInt values to their string representation
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns The string representation of the BigInt or the original value
 */
export const bigIntToString: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value as JsonValue;
};

/**
 * Converts Date objects to ISO format strings
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns The ISO string representation of the Date or the original value
 */
export const dateToISOString: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value as JsonValue;
};

/**
 * Converts undefined values to null
 * This makes undefined values serializable in JSON
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns null if the value is undefined, otherwise the original value
 */
export const undefinedToNull: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (value === undefined) {
    return null;
  }
  return value as JsonValue;
};

/**
 * Converts function values to a string placeholder
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns "[Function]" if the value is a function, otherwise the original value
 */
export const functionToString: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (typeof value === "function") {
    return "[Function]";
  }
  return value as JsonValue;
};

/**
 * Converts Error objects to a JSON-compatible object
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns A JSON-compatible object representing the Error or the original value
 */
export const errorToObject: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (value instanceof Error) {
    const errorObj: JsonObject = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
    return errorObj;
  }
  return value as JsonValue;
};

/**
 * Converts Map objects to JSON-compatible objects
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns A JSON-compatible object representing the Map or the original value
 */
export const mapToObject: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (value instanceof Map) {
    const obj: JsonObject = {};
    value.forEach((val, key) => {
      // Only add values that can be safely converted to JsonValue
      const safeVal = val as unknown;
      if (
        safeVal === null ||
        ["string", "number", "boolean", "undefined"].includes(typeof safeVal) ||
        safeVal instanceof Date ||
        typeof safeVal === "bigint"
      ) {
        obj[String(key)] = safeVal as JsonValue;
      } else {
        obj[String(key)] = JSON.stringify(safeVal);
      }
    });
    return obj;
  }
  return value as JsonValue;
};

/**
 * Converts Set objects to JSON-compatible arrays
 *
 * @param _key The current key being processed (unused)
 * @param value The value to process
 * @returns A JSON-compatible array representing the Set or the original value
 */
export const setToArray: ReplacerMixin = (_key: string, value: JsValue): JsonValue => {
  if (value instanceof Set) {
    const array: JsonValue[] = [];
    value.forEach(item => {
      // Only add values that can be safely converted to JsonValue
      const safeItem = item as unknown;
      if (
        safeItem === null ||
        ["string", "number", "boolean", "undefined"].includes(typeof safeItem) ||
        safeItem instanceof Date ||
        typeof safeItem === "bigint"
      ) {
        array.push(safeItem as JsonValue);
      } else {
        array.push(JSON.stringify(safeItem));
      }
    });
    return array;
  }
  return value as JsonValue;
};
