import {
  Statement,
  Program,
  Expression,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  NullLiteral,
  VariableDeclaration,
  AssignmentExpr,
  Property,
  ObjectLiteral,
  ExpressionStatement,
} from "./ast.ts";
import { lex, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private isEOF(): boolean {
    return this.tokens[0].type == TokenType.EOF;
  }

  private at(): Token {
    return this.tokens[0] as Token;
  }

  private next() {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, error: string) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.log(prev);
      throw error + " Found '" + prev + " Expected: '" + TokenType[type] + "'";
    }

    return prev;
  }

  public buildAST(content: string): Program {
    this.tokens = lex(content);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (!this.isEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private parseStatement(): Statement {
    switch (this.at().type) {
      case TokenType.Var:
      case TokenType.Mutable:
        return this.parseVariableDeclaration();
      default: {
        // Wrap bare expressions as ExpressionStatement
        const expr = this.parseExpression();
        return {
          kind: "ExpressionStatement",
          expression: expr,
        } as ExpressionStatement;
      }
    }
  }

  parseVariableDeclaration(): Statement {
    this.next();
    const isMutable = this.at().type == TokenType.Mutable;
    if (isMutable) this.next();

    const identifier = this.expect(
      TokenType.Indentifier,
      "Expected variable name after declaration keyword(s)."
    ).value;

    if (this.at().type == TokenType.Semicolon) {
      this.next();
      if (!isMutable) {
        throw "Cannot leave value of non-mutable variable as undefined.";
      }

      return {
        kind: "VariableDeclaration",
        mutable: isMutable,
        identifier: identifier,
        value: undefined,
      } as VariableDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Equals identifier expected after declaration keyword(s)."
    );

    const declaration = {
      kind: "VariableDeclaration",
      mutable: isMutable,
      identifier,
      value: this.parseExpression(),
    } as VariableDeclaration;

    // this.expect(TokenType.Semicolon, "Semicolon expected at end of line.");

    return declaration;
  }

  private parseExpression(): Expression {
    return this.parseAssignmentExpr();
  }

  parseAssignmentExpr(): Expression {
    const left = this.parseObjectExpr();

    if (this.at().type == TokenType.Equals) {
      this.next();
      const value = this.parseAssignmentExpr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  parseObjectExpr(): Expression {
    if (this.at().type != TokenType.OpenBraces) {
      return this.parseAdditiveExpr();
    }

    this.next();
    const properties = new Array<Property>();

    while (!this.isEOF() && this.at().type != TokenType.ClosedBraces) {
      const key = this.expect(
        TokenType.Indentifier,
        "Key expected in object."
      ).value;

      if (
        this.at().type == TokenType.Comma ||
        this.at().type == TokenType.ClosedBraces
      ) {
        this.expect(
          TokenType.Indentifier,
          "Value required in object literal. (Shorthand unsupported.)"
        );
      }

      this.expect(TokenType.Colon, "Colon expected after object key.");
      const value = this.parseExpression();

      properties.push({ kind: "Property", key: key, value: value });
      if (this.at().type != TokenType.ClosedBraces) {
        this.expect(
          TokenType.Comma,
          "Comma or closed brace expected after key/value pair."
        );
      }
    }

    this.expect(
      TokenType.ClosedBraces,
      "Closed brace expected after declaration of object."
    );

    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parseAdditiveExpr(): Expression {
    let left = this.parseMultiplicativeExpr();

    while ("+-".includes(this.at().value)) {
      const operator = this.next().value;
      const right = this.parseMultiplicativeExpr();
      left = {
        kind: "BinaryExpr",
        left,
        operator,
        right,
      } as BinaryExpr;
    }

    return left;
  }

  private parseMultiplicativeExpr(): Expression {
    let left = this.parsePrimaryExpr();

    while ("*/%".includes(this.at().value)) {
      const operator = this.next().value;
      const right = this.parsePrimaryExpr();
      left = {
        kind: "BinaryExpr",
        left,
        operator,
        right,
      } as BinaryExpr;
    }

    return left;
  }

  private parsePrimaryExpr(): Expression {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Indentifier: {
        return { kind: "Identifier", symbol: this.next().value } as Identifier;
      }
      case TokenType.Number: {
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.next().value),
        } as NumericLiteral;
      }
      case TokenType.OpenParentheses: {
        this.next();
        const value = this.parseExpression();
        this.expect(
          TokenType.ClosedParantheses,
          "Unexpected token after opening parantheses."
        );
        return value;
      }
      case TokenType.Null: {
        this.next();
        return { kind: "NullLiteral", value: null } as NullLiteral;
      }
      default: {
        console.log("TokenType ?: " + TokenType[this.at().type]);
        // throw "err";
        return { kind: "NullLiteral", value: null } as NullLiteral;
      }
    }
  }
}
