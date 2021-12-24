export * from './exprtk.js';
import { createExprtk, Variable, Vector } from './exprtk.js';

/*
configuration: {
  expression: string,
  symbolTable?: {
    variables?: [
      {
        name: string,
        value?: number
      }
    ],
    vectors?: [
      {
        name: string,
        size: number,
        value?: number[]
      }
    ]
  }
}
*/

const validateConfiguration = function (configuration) {
  // do it, see above
  // maybe combo of https://github.com/vega/ts-json-schema-generator
  //   or https://transform.tools/typescript-to-json-schema
  // and ajv?
};

const validateVariable = function (symbolCache, name) {
  const variable = symbolCache.get(name);
  if (!variable) {
    throw new Error(`No symbol found with name: ${name}`);
  }
  if (!(variable instanceof Variable)) {
    throw new Error(`Symbol with following name is not a valid variable: ${name}`);
  }
  return variable;
}

const validateVector = function (symbolCache, name) {
  const vector = symbolCache.get(name);
  if (!vector) {
    throw new Error(`No symbol found with name: ${name}`);
  }
  if (!(vector instanceof Vector)) {
    throw new Error(`Symbol with following name is not a valid vector: ${name}`);
  }
  return vector;
}

const populateSymbolTable = function (symbolTable, configuration) {
  const symbolCache = new Map();
  if (configuration.symbolTable) {
    if (configuration.symbolTable.variables) {
      for (const variableConfig of configuration.symbolTable.variables) {
        const variable = symbolTable.createVariable(variableConfig.name);
        symbolCache.set(variableConfig.name, variable);

        const value = variableConfig.value;
        if (value !== undefined) {
          variable.value = value;
        }
      }
    }
    if (configuration.symbolTable.vectors) {
      for (const vectorConfig of configuration.symbolTable.vectors) {
        const vector = symbolTable.createVector(vectorConfig.name, vectorConfig.size);
        symbolCache.set(vectorConfig.name, vector);

        const value = vectorConfig.value;
        if (value !== undefined) {
          vector.assign(value);
        }
      }
    }
  }
  return symbolCache;
};

// NOTE: All parameters return values should be structured cloneable to support Comlink
export class Exorbitant {
  constructor(exprtk, configuration) {
    validateConfiguration(configuration);

    this._symbolTable = exprtk.createSymbolTable();
    this._symbolTable.addConstants();
    this._symbolTable.addPackageIO();
    this._symbolTable.addPackageVecops();
    this._symbolTable.addPackageArmadillo();
    this._symbolTable.addPackageSigpack();

    this._symbolCache = populateSymbolTable(this._symbolTable, configuration);

    this._expression = exprtk.createExpression();
    this._expression.registerSymbolTable(this._symbolTable);

    this._parser = exprtk.createParser();
    this._parser.compile(configuration.expression, this._expression);
  }

  getVariable (name) {
    const variable = validateVariable(this._symbolCache, name);
    return variable.value;
  }

  setVariable (name, value) {
    const variable = validateVariable(this._symbolCache, name);
    variable.value = value;
  }

  getVector (name) {
    const vector = validateVector(this._symbolCache, name);
    const vectorBufferView = vector.createBufferView();
    const vectorCopy = new Float64Array(vectorBufferView);
    return vectorCopy;
  }

  setVector (name, value) {
    const vector = validateVector(this._symbolCache, name);
    vector.assign(value);
  }

  calculateValue () {
    return this._expression.value();
  }
}

export class ExorbitantRuntime {
  constructor (exprtk) {
      this._exprtk = exprtk;
  }

  createExorbitant (configuration) {
    return new Exorbitant(this._exprtk, configuration);
  }
}

export const createExorbitantRuntime = async function () {
  const exprtk = await createExprtk();
  return new ExorbitantRuntime(exprtk)
};
