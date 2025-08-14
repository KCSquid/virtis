import { RuntimeValue } from "./values.ts";

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;
  private constants: Set<string>;

  constructor(parentEnvironment?: Environment) {
    this.parent = parentEnvironment;
    this.variables = new Map();
    this.constants = new Set();
  }

  public resolve(variableName: string): Environment {
    if (this.variables.has(variableName)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Variable '${variableName}' does not exist.`;
    }
    
    return this.parent.resolve(variableName);
  }

  public declareVariable(
    variableName: string,
    value: RuntimeValue,
    isMutable: boolean
  ): RuntimeValue {
    if (this.variables.has(variableName)) {
      throw `Cannot use pre-defined variable '${variableName}' as new variable name.`;
    }

    this.variables.set(variableName, value);

    if (!isMutable) {
      this.constants.add(variableName);
    }

    return value;
  }

  public setVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(variableName);
    if (env.constants.has(variableName)) {
      throw `Cannot reassign the value of non-mutable variable '${variableName}'.`;
    }
    env.variables.set(variableName, value);

    return value;
  }

  public getVariableValue(variableName: string): RuntimeValue {
    const env = this.resolve(variableName);
    return env.variables.get(variableName) as RuntimeValue;
  }
}
