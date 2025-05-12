/**
 * Represents any JSON-serializable value
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray
  | Date
  | bigint
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any;

/**
 * Represents a JSON object with string keys and JsonValue values
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * Represents a JSON array of JsonValue elements
 */
export type JsonArray = JsonValue[];

/**
 * Represents any JavaScript value that might be passed to JSON.stringify
 * This is more comprehensive than JsonValue as it includes non-JSON-serializable types
 */
export type JsValue =
  | symbol
  | ((...args: unknown[]) => unknown)
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Error
  | JsonValue;

/**
 * A replacer function for JSON.stringify
 * @param key The current key being processed
 * @param value The current value being processed
 * @returns The transformed value or the original value
 */
export type ReplacerMixin = (key: string, value: JsValue) => JsonValue;

/**
 * Combines multiple replacer functions into a single replacer function
 * Each function is applied in sequence, with each receiving the output of the previous function
 *
 * @param mixins Array of replacer functions to combine
 * @returns A single replacer function that applies all mixins in order
 */
export function combineReplacers(
  mixins: ReplacerMixin[],
): (key: string, value: JsValue) => JsonValue {
  return (key: string, value: JsValue) => {
    // Cast the initial value and each reducer result to ensure we're handling type transitions properly
    let result: JsonValue = value as unknown as JsonValue;

    for (const mixin of mixins) {
      result = mixin(key, result as unknown as JsValue);
    }

    return result;
  };
}

/**
 * Enhanced version of JSON.stringify that supports composable replacer mixins
 *
 * @param value The value to convert to a JSON string
 * @param replacer Array of replacer functions, a single replacer function, null, or an array of String and Number objects
 * @param space Number of spaces for indentation or string to use for indentation
 * @returns A JSON string representing the value
 */
export function stringify(
  value: JsValue,
  replacer?: ReplacerMixin[] | ReplacerMixin | null | (string | number)[],
  space?: string | number,
): string {
  // Handle the case when replacer is an array of mixins
  if (Array.isArray(replacer) && replacer.length > 0 && typeof replacer[0] === "function") {
    // If we have function mixins, combine them into a single replacer
    return JSON.stringify(value, combineReplacers(replacer as ReplacerMixin[]), space);
  }

  // Handle the case when replacer is a single function
  if (typeof replacer === "function") {
    return JSON.stringify(value, replacer as (key: string, value: unknown) => unknown, space);
  }

  // Otherwise, use standard JSON.stringify behavior for arrays of strings/numbers or null
  return JSON.stringify(value, replacer as (string | number)[] | null, space);
}
