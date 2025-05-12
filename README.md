# Composable JSON Stringify

A flexible and powerful library that extends JavaScript's native `JSON.stringify` with composable replacer functions.

## The Problem with JSON.stringify

JavaScript's built-in `JSON.stringify` is powerful but has significant limitations when dealing with certain data types:

- **BigInt values** throw errors (commonly used in libraries like Kysely)
- **Date objects** are converted to strings without using ISO format
- **Symbol values** can't be stringified
- **Function values** are omitted
- **Map and Set objects** aren't serialized properly
- **Error objects** lose most of their information

Traditionally, to handle these cases, you'd have to write a complex replacer function that handles every edge case:

```javascript
JSON.stringify(data, (key, value) => {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "symbol") return value.toString();
  if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack };
  // ... and so on for every type you need to handle
  return value;
});
```

This approach becomes unwieldy as your data gets more complex.

## The Solution: Composable Replacers

This library lets you compose small, focused replacer functions (mixins) to handle specific data types:

```javascript
import { stringify, bigIntToString, dateToISOString, symbolToString } from '@mastermindzh/composable-json-stringify';

const data = {
  id: 123456789n,
  name: "Example",
  created: new Date(),
  type: Symbol("user")
};

// Compose only the replacers you need
const json = stringify(data, [
  bigIntToString,
  dateToISOString,
  symbolToString
]);
```

## Features

- 🧩 **Composable** - Mix and match replacers to fit your needs
- 🔌 **Extensible** - Create your own replacer mixins easily
- 🎯 **Focused** - Each replacer handles one specific data type
- 📦 **Zero dependencies** - Lightweight and efficient
- 🔍 **Type-safe** - Written in TypeScript with full type definitions

## Installation

```bash
npm install @mastermindzh/composable-json-stringify
```

## Available Replacers

The library comes with several pre-built replacers:

- `bigIntToString` - Converts BigInt values to strings
- `symbolToString` - Converts Symbol values to strings
- `dateToISOString` - Converts Date objects to ISO format strings
- `undefinedToNull` - Converts undefined values to null
- `functionToString` - Converts functions to "[Function]" strings
- `errorToObject` - Converts Error objects to serializable objects
- `mapToObject` - Converts Map objects to plain objects
- `setToArray` - Converts Set objects to arrays

## Creating Custom Replacers

You can easily create your own replacer mixins:

```javascript
import { ReplacerMixin } from '@mastermindzh/composable-json-stringify';

const customReplacer: ReplacerMixin = (key, value) => {
  if (key === "password") {
    return "[REDACTED]";
  }
  return value;
};
```

## Creating a Custom stringify Function

You can export a custom stringify function with your preferred defaults:

```javascript
import { stringify, bigIntToString, dateToISOString, undefinedToNull } from '@mastermindzh/composable-json-stringify';

// Create a custom stringify with your commonly used replacers
export const myStringify = (value, space) => {
  return stringify(value, [
    bigIntToString,
    dateToISOString,
    undefinedToNull
  ], space);
};
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
