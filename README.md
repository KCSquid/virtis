# Vertis

Vertis is a simple toy interpreted language implemented in TypeScript/Deno. It supports variable declarations, arithmetic, mutable variables, object literals, nested objects, and null values.

## Features

- Variable declaration (`var`)
- Mutable variables (`var mut`)
- Arithmetic operations (`+`, `-`, `*`, `/`, `%`)
- Object literals and nested objects
- Null and boolean values
- Simple REPL and file execution

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) (for development)
- Node.js (for running via Node)

### Installation

Clone the repository:

```sh
git clone https://github.com/KCSquid/virtis.git
cd virtis
```

### Running

To execute a `.vrt` file:

```sh
deno run -A src/virtis.ts -f main.vrt
```

Or start the interactive shell:

```sh
deno run -A src/virtis.ts
```

## Example

Below are some example Vertis programs (from [`main.vrt`](./main.vrt)):

```vrt
// Variable declaration and arithmetic
var x = 10;
var y = 20;
var sum = x + y;

// Mutable variable
var mut counter = 0;
counter = counter + 1;

// Object literals
var point = {
  x: 5,
  y: 7
};

// Nested objects and referencing variables
var foo = 42;
var obj = {
  a: 1,
  b: foo,
  nested: {
    c: true
  }
};

// Null values
var nothing = null;
```

### Example Output

```plaintext
x       // { value: 10, type: "number" }
y       // { value: 20, type: "number" }
sum     // { value: 30, type: "number" }
counter // { value: 1, type: "number" }
point   // { kind: "ObjectLiteral", properties: [ ... ] }
foo     // { value: 42, type: "number" }
obj     // { kind: "ObjectLiteral", properties: [ ... ] }
nothing // { type: "null", value: null }
```

## License

MIT