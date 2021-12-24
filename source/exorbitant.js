import { createExprtk, Variable, Vector } from './exprtk.js';
import configurationIsValid from '../dist/types/configuration.js';

export * from './exprtk.js';

const validateConfiguration = function (configuration) {
    if (!configurationIsValid(configuration)) {
        throw new Error('Invalid configuration');
    }
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
};

const validateVector = function (symbolCache, name) {
    const vector = symbolCache.get(name);
    if (!vector) {
        throw new Error(`No symbol found with name: ${name}`);
    }
    if (!(vector instanceof Vector)) {
        throw new Error(`Symbol with following name is not a valid vector: ${name}`);
    }
    return vector;
};

const populateSymbolTable = function (symbolTable, configuration) {
    const symbolCache = new Map();
    const isDefined = value => value !== undefined;
    if (isDefined(configuration.symbolTable)) {
        if (isDefined(configuration.symbolTable.variables)) {
            for (const variableConfig of configuration.symbolTable.variables) {
                const variable = symbolTable.createVariable(variableConfig.name);
                symbolCache.set(variableConfig.name, variable);

                if (isDefined(variableConfig.value)) {
                    variable.value = variableConfig.value;
                }
            }
        }
        if (isDefined(configuration.symbolTable.vectors)) {
            for (const vectorConfig of configuration.symbolTable.vectors) {
                const vector = symbolTable.createVector(vectorConfig.name, vectorConfig.size);
                symbolCache.set(vectorConfig.name, vector);

                if (isDefined(vectorConfig.value)) {
                    vector.assign(vectorConfig.value);
                }
            }
        }
    }
    return symbolCache;
};

// NOTE: All parameters return values should be structured cloneable to support Comlink
export class Exorbitant {
    constructor (exprtk, configuration) {
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

    value () {
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
    return new ExorbitantRuntime(exprtk);
};
