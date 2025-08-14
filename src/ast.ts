export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "CallExpr"
  | "UnaryExpr"
  | "FunctionDeclaration"
  | "NullLiteral"
  | "VariableDeclaration"
  | "AssignmentExpr"
  | "Property"
  | "ObjectLiteral"
  | "ExpressionStatement";

export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  kind: "VariableDeclaration";
  mutable: boolean;
  identifier: string;
  value?: Expression;
}

export interface Expression extends Statement { }

export interface AssignmentExpr extends Expression {
  kind: "AssignmentExpr";
  assigne: Expression;
  value: Expression;
}

export interface BinaryExpr extends Expression {
  kind: "BinaryExpr";
  left: Expression;
  operator: string;
  right: Expression;
}

export interface Identifier extends Expression {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Expression {
  kind: "NullLiteral";
  value: null;
}

export interface Property extends Expression {
  kind: "Property";
  key: string;
  value?: Expression;
}

export interface ObjectLiteral extends Expression {
  kind: "ObjectLiteral";
  properties: Property[];
}

export interface ExpressionStatement extends Statement {
  kind: "ExpressionStatement";
  expression: Expression;
}
