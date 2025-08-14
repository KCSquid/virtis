import { NumberValue, RuntimeValue, NullValue } from "./values.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
  VariableDeclaration,
  ExpressionStatement,
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
  environment: Environment,
  shell: boolean = false
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

    case "ExpressionStatement": {
      const exprStmt = tree as ExpressionStatement;
      const value = interpret(exprStmt.expression, environment);

      // dont repeat in shell & is not variable assignment
      if (!shell && exprStmt.expression.kind !== "AssignmentExpr") {
        console.log(value)
      }

      return value;
    }

    default:
      // console.log(tree);
      return tree as any;
    // throw `AST Node ?: ${tree}`;
  }
}