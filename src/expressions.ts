import { Identifier, BinaryExpr, AssignmentExpr } from "./ast.ts";
import Environment from "./environment.ts";
import { interpret } from "./interpret.ts";
import { RuntimeValue, NumberValue, NullValue } from "./values.ts";

export function evaluateIdentifier(
  indentifier: Identifier,
  environment: Environment
): RuntimeValue {
  const variableValue = environment.getVariableValue(indentifier.symbol);
  return variableValue;
}

export function evaluateBinaryExpression(
  binop: BinaryExpr,
  environment: Environment
): RuntimeValue {
  const leftSide = interpret(binop.left, environment);
  const rightSide = interpret(binop.right, environment);

  if (leftSide.type == "number" && rightSide.type == "number") {
    return evaluateNumericExpression(
      leftSide as NumberValue,
      rightSide as NumberValue,
      binop.operator
    );
  }

  return { type: "null", value: null } as NullValue;
}

function evaluateNumericExpression(
  left: NumberValue,
  right: NumberValue,
  operator: string
): NumberValue {
  let num: number = 0;
  switch (operator) {
    case "+":
      num = left.value + right.value;
      break;
    case "-":
      num = left.value - right.value;
      break;
    case "*":
      num = left.value * right.value;
      break;
    case "/":
      num = left.value / right.value;
      break;
    case "%":
      num = left.value % right.value;
      break;
  }

  return { type: "number", value: num };
}

export function evaluateAssignment(
  node: AssignmentExpr,
  environment: Environment
): RuntimeValue {
  if (node.assigne.kind != "Identifier") {
    throw `Cannot assign to things other than an identifier.`;
  }

  const variableName = (node.assigne as Identifier).symbol;
  return environment.setVariable(
    variableName,
    interpret(node.value, environment)
  );
}
