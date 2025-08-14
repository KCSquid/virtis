import { NumberValue, RuntimeValue, NullValue } from "./values.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
  VariableDeclaration,
} from "./ast.ts";
import Environment from "./environment.ts";
import {
  evaluateIdentifier,
  evaluateBinaryExpression,
  evaluateAssignment,
} from "./expressions.ts";
import { evaluateProgram, evaluateVariableDeclaration } from "./statements.ts";

export function interpret(
  tree: Statement,
  environment: Environment
): RuntimeValue {
  switch (tree.kind) {
    case "NumericLiteral":
      return {
        value: (tree as NumericLiteral).value,
        type: "number",
      } as NumberValue;

    case "Identifier":
      return evaluateIdentifier(tree as Identifier, environment);

    case "NullLiteral":
      return { type: "null", value: null } as NullValue;

    case "BinaryExpr":
      return evaluateBinaryExpression(tree as BinaryExpr, environment);

    case "Program":
      return evaluateProgram(tree as Program, environment);

    case "VariableDeclaration":
      return evaluateVariableDeclaration(
        tree as VariableDeclaration,
        environment
      );

    case "AssignmentExpr":
      return evaluateAssignment(tree as AssignmentExpr, environment);

    default:
      // console.log(tree);
      return tree as any
    // throw `AST Node ?: ${tree}`;
  }
}
