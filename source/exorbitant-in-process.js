import { createExprtk } from './exprtk.js';
import configurationIsValid from '../dist/types/configuration.js';

export * from './exprtk.js';

const validateConfiguration = function (configuration) {
    if (!configurationIsValid(configuration)) {
        throw new Error('Invalid configuration');
    }
};

class SymbolCache {
    constructor (symbolTable, symbolTableConfig) {
        this._variableMap = new Map();
        this._vectorMap = new Map();

        const isDefined = value => value !== undefined;
        if (isDefined(symbolTableConfig)) {
            if (isDefined(symbolTableConfig.variables)) {
                for (const variableConfig of symbolTableConfig.variables) {
                    const variable = symbolTable.createVariable(variableConfig.name);
                    this._variableMap.set(variableConfig.name, variable);

                    if (isDefined(variableConfig.value)) {
                        variable.value = variableConfig.value;
                    }
                }
            }
            if (isDefined(symbolTableConfig.vectors)) {
                for (const vectorConfig of symbolTableConfig.vectors) {
                    const vector = symbolTable.createVector(vectorConfig.name, vectorConfig.size);
                    this._vectorMap.set(vectorConfig.name, vector);

                    if (isDefined(vectorConfig.value)) {
                        vector.assign(vectorConfig.value);
                    }
                }
            }
        }
    }

    destroy () {
        for (const [, variable] of this._variableMap) {
            variable.destroy();
        }
        this._variableMap = undefined;
        for (const [, vector] of this._vectorMap) {
            vector.destroy();
        }
        this._vectorMap = undefined;
    }

    getVariable (name) {
        const variable = this._variableMap.get(name);
        if (!variable) {
            throw new Error(`Symbol with following name is not a valid variable: ${name}`);
        }
        return variable;
    }

    getVector (name) {
        const vector = this._vectorMap.get(name);
        if (!vector) {
            throw new Error(`Symbol with following name is not a valid vector: ${name}`);
        }
        return vector;
    }
}

// NOTE: All parameters return values should be structured cloneable to support Comlink
class Exorbitant {
    constructor (exprtk, configuration) {
        validateConfiguration(configuration);

        this._symbolTable = exprtk.createSymbolTable();
        this._symbolTable.addConstants();
        this._symbolTable.addPackageIO();
        this._symbolTable.addPackageVecops();
        this._symbolTable.addPackageArmadillo();
        this._symbolTable.addPackageSigpack();

        this._symbolCache = new SymbolCache(this._symbolTable, configuration.symbolTable);

        this._expression = exprtk.createExpression();
        this._expression.registerSymbolTable(this._symbolTable);

        this._parser = exprtk.createParser();
        this._parser.compile(configuration.expression, this._expression);
    }

    destroy () {
        this._symbolTable.destroy();
        this._symbolTable = undefined;
        this._symbolCache.destroy();
        this._symbolCache = undefined;
        this._expression.destroy();
        this._expression = undefined;
        this._parser.destroy();
        this._parser = undefined;
    }

    getVariable (name) {
        const variable = this._symbolCache.getVariable(name);
        return variable.value;
    }

    setVariable (name, value) {
        const variable = this._symbolCache.getVariable(name);
        variable.value = value;
    }

    getVector (name) {
        const vector = this._symbolCache.getVector(name);
        const vectorBufferView = vector.createBufferView();
        const vectorCopy = new Float64Array(vectorBufferView);
        return vectorCopy;
    }

    setVector (name, value) {
        const vector = this._symbolCache.getVector(name);
        vector.assign(value);
    }

    value () {
        return this._expression.value();
    }
}

class ExorbitantRuntime {
    constructor () {
        this._exprtk = undefined;
    }

    destroy () {
        if (this._exprtk) {
            this._exprtk.destroy();
            this._exprtk = undefined;
        }
    }

    async createExorbitant (configuration) {
        if (this._exprtk === undefined) {
            this._exprtk = await createExprtk();
        }
        return new Exorbitant(this._exprtk, configuration);
    }
}

export const createExorbitantRuntime = function () {
    return new ExorbitantRuntime();
};
