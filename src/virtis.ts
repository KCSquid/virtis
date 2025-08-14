import Parser from "./parser.ts";
import { interpret } from "./interpret.ts";
import Environment from "./environment.ts";
import { BooleanValue, NumberValue } from "./values.ts";
import * as fs from "node:fs";
import process from "node:process";

function declareGlobalVariables(environment: Environment) {
  environment.declareVariable(
    "true",
    {
      type: "boolean",
      value: true,
    } as BooleanValue,
    false
  );
  environment.declareVariable(
    "false",
    {
      type: "boolean",
      value: false,
    } as BooleanValue,
    false
  );
}

function shell() {
  const parser = new Parser();
  const environment = new Environment();

  // keywords
  declareGlobalVariables(environment);

  // testing
  // environment.declareVariable(
  //   "x",
  //   {
  //     type: "number",
  //     value: 5,
  //   } as NumberValue,
  //   false
  // );

  // shell
  console.log("Shell ~ Vertis v1.1");
  while (true) {
    const input = prompt("> ");

    if (!input) {
      continue;
    }

    if (input == "exit") {
      break;
    }

    const program = parser.buildAST(input);
    const result = interpret(program, environment);
    console.log("\nTree:\n", program, "\n\nResult:\n", result, "\n\n-----\n");
  }
}

function comp() {
  const parser = new Parser();
  const environment = new Environment();

  // keywords
  declareGlobalVariables(environment);

  const args = process.argv.slice(2);

  if (!args.length) {
    shell();
    return;
  }

  if (args.includes("-h")) {
    console.log("Usage: virtis [-f <file>] [-h]");
    console.log("  -f <file>   Run the specified .vrt file");
    console.log("  -h          Show this help message");
    process.exit(0);
  }

  let filename = "./main.vrt";
  const fileFlagIndex = args.indexOf("-f");
  if (fileFlagIndex !== -1) {
    if (args.length > fileFlagIndex + 1) {
      filename = args[fileFlagIndex + 1];
    } else {
      throw "Missing file after -f flag. Use 'virtis -h' for help.";
    }
  } else if (args.length > 0) {
    throw "Invalid command usage. Use 'virtis -h' for help.";
  }

  const tree = parser.buildAST(fs.readFileSync(filename, "utf8"));
  const result = interpret(tree, environment);
  console.log("\nResult:\n", result, "\n");
}

comp();
