import { Program, VariableDeclaration } from "./ast.ts";
import Environment from "./environment.ts";
import { interpret } from "./interpret.ts";
import { RuntimeValue, NullValue } from "./values.ts";

export function evaluateProgram(
  program: Program,
  environment: Environment
): RuntimeValue {
  let last: RuntimeValue = { type: "null", value: null } as NullValue;

  for (const statement of program.body) {
    last = interpret(statement, environment);
  }

  return last;
}

export function evaluateVariableDeclaration(
  declaration: VariableDeclaration,
  environment: Environment
): RuntimeValue {
  const value = declaration.value
    ? interpret(declaration.value, environment)
    : ({ type: "null", value: null } as NullValue);
  return environment.declareVariable(
    declaration.identifier,
    value,
    declaration.mutable
  );
}
