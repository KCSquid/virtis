// var x = 45 + ( a * b )

export enum TokenType {
  Number,
  BinaryOperator,
  Equals,
  Semicolon,
  Comma,
  Colon,
  Indentifier,
  String,
  OpenParentheses,
  ClosedParantheses,
  OpenBraces,
  ClosedBraces,
  Var,
  Mutable,
  Null,
  EOF,
}

const RESERVED: Record<string, TokenType> = {
  var: TokenType.Var,
  null: TokenType.Null,
  mut: TokenType.Mutable,
};

export interface Token {
  type: TokenType;
  value: string;
}

function buildToken(type: TokenType, value = ""): Token {
  return { type, value };
}

function IsAlphaNumeric(source: string) {
  return source.toUpperCase() != source.toLowerCase();
}

function isNumeric(source: string) {
  const int = source.charCodeAt(0);
  return int >= "0".charCodeAt(0) && int <= "9".charCodeAt(0);
}

function isWhiteSpace(source: string) {
  return " \n\t\r".includes(source);
}

export function lex(content: string): Token[] {
  const tokens = new Array<Token>();

  content = content.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

  const src = content.split("");

  while (src.length > 0) {
    // single chars
    if (src[0] == "(") {
      tokens.push(buildToken(TokenType.OpenParentheses, src.shift()));
    } else if (src[0] == ")") {
      tokens.push(buildToken(TokenType.ClosedParantheses, src.shift()));
    } else if (src[0] == "{") {
      tokens.push(buildToken(TokenType.OpenBraces, src.shift()));
    } else if (src[0] == "}") {
      tokens.push(buildToken(TokenType.ClosedBraces, src.shift()));
    } else if ("+-*/%".includes(src[0])) {
      tokens.push(buildToken(TokenType.BinaryOperator, src.shift()));
    } else if (src[0] == "=") {
      tokens.push(buildToken(TokenType.Equals, src.shift()));
    } else if (src[0] == ",") {
      tokens.push(buildToken(TokenType.Comma, src.shift()));
    } else if (src[0] == ":") {
      tokens.push(buildToken(TokenType.Colon, src.shift()));
    } else if (src[0] == ";") {
      src.shift();
      continue;
      // tokens.push(buildToken(TokenType.Semicolon, src.shift()));
    }

    // long
    else {
      if (isNumeric(src[0])) {
        let found = "";
        while (src.length > 0 && isNumeric(src[0])) {
          found += src.shift();
        }

        tokens.push(buildToken(TokenType.Number, found));
      } else if (IsAlphaNumeric(src[0])) {
        let found = "";
        while (src.length > 0 && IsAlphaNumeric(src[0])) {
          found += src.shift();
        }

        const isKeyword = RESERVED[found];
        if (!isKeyword) {
          tokens.push(buildToken(TokenType.Indentifier, found));
        } else {
          tokens.push(buildToken(isKeyword, found));
        }
      } else if (isWhiteSpace(src[0])) {
        src.shift();
      } else {
        throw "Lexer ?: " + src[0];
      }
    }
  }

  tokens.push(buildToken(TokenType.EOF, "EOF"));

  // show tokens
  // tokens.forEach((element) => {
  //   console.log(element);
  // });
  // console.log();

  return tokens;
}
