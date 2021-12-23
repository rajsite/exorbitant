// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

import exprtkcore from '../dist/exprtkcore.js';

// Make sure to use Module.stackSave() before calling
const writeStringToStack = function (Module, str) {
    var strMaxStackLength = (str.length << 2) + 1;
    var strStackPointer = Module.stackAlloc(strMaxStackLength);
    Module.stringToUTF8(str, strStackPointer, strMaxStackLength);
    return strStackPointer;
};

export class Variable {
    constructor (Module, variableRef) {
        this._Module = Module;
        this._variableRef = variableRef;
    }

    set value (number) {
        this._Module.HEAPF64[this._variableRef / 8] = number;
    }

    get value () {
        return this._Module.HEAPF64[this._variableRef / 8];
    }
}

export class Vector {
    constructor (Module, vectorRef, size) {
        this._Module = Module;
        this._vectorRef = vectorRef;
        this._size = size;
    }

    // Only valid until before another function used. DO NO SAVE REFERENCE.
    // Memory growth due to function execution will invalidate buffer.
    createBufferView () {
        return new Float64Array(this._Module.HEAPF64.buffer, this._vectorRef, this._size);
    }

    assign (arrayLike) {
        for (let i = this._vectorRef / 8; i < this._size; i++) {
            this._Module.HEAPF64[i] = arrayLike[i];
        }
    }
}

export class SymbolTable {
    constructor (Module, symbolTableRef) {
        this._Module = Module;
        this._symbolTableRef = symbolTableRef;
        this.addConstants();
        this.addPackageIO();
        this.addPackageVecops();
        this.addPackageArmadillo();
        this.addPackageSigpack();
    }

    addConstants() {
        const result = this._Module._SymbolTable_AddConstants(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddConstants');
        }
    }

    addPackageIO() {
        const result = this._Module._SymbolTable_AddPackageIO(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddPackageIO');
        }
    }

    addPackageVecops() {
        const result = this._Module._SymbolTable_AddPackageVecops(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AppPackageVecops');
        }
    }

    addPackageArmadillo() {
        const result = this._Module._SymbolTable_AddPackageArmadillo(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddPackageArmadillo');
        }
    }

    addPackageSigpack() {
        const result = this._Module._SymbolTable_AddPackageSigpack(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddPackageSigpack');
        }
    }

    createVariable (name) {
        const variableRef = this._Module._malloc(8);
        if (variableRef === 0) {
            throw new Error(`Not enough memory to allocate variable ${name}.`);
        }
        const stack = this._Module.stackSave();
        const nameRef = writeStringToStack(this._Module, name);
        const result = this._Module._SymbolTable_AddVariable(this._symbolTableRef, nameRef, variableRef);
        this._Module.stackRestore(stack);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error(`Failed to create variable with name ${name}`);
        }
        const ret = new Variable(this._Module, variableRef);
        this._Module.exprtkcore.flush();
        return ret;
    }

    createVector (name, size) {
        const vectorRef = this._Module._malloc(size * 8);
        if (vectorRef === 0) {
            throw new Error(`Not enough memory to allocate vector ${name} with size ${size}.`);
        }
        const stack = this._Module.stackSave();
        const nameRef = writeStringToStack(this._Module, name);
        const result = this._Module._SymbolTable_AddVector(this._symbolTableRef, nameRef, vectorRef, size);
        this._Module.stackRestore(stack);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error(`Failed to create vector with name ${name}`);
        }
        const ret = new Vector(this._Module, vectorRef, size);
        this._Module.exprtkcore.flush();
        return ret;
    }
}

export class Expression {
    constructor (Module, expressionRef) {
        this._Module = Module;
        this._expressionRef = expressionRef;
    }

    registerSymbolTable (symbolTable) {
        this._Module._Expression_RegisterSymbolTable(this._expressionRef, symbolTable._symbolTableRef);
        this._Module.exprtkcore.flush();
    }

    value () {
        const ret = this._Module._Expression_Value(this._expressionRef);
        this._Module.exprtkcore.flush();
        return ret;
    }
}

export class Parser {
    constructor (Module, parserRef) {
        this._Module = Module;
        this._parserRef = parserRef;
    }

    compile (str, expression) {
        const stack = this._Module.stackSave();
        const strRef = writeStringToStack(this._Module, str);
        const result = this._Module._Parser_Compile(this._parserRef, strRef, expression._expressionRef);
        this._Module.stackRestore(stack);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error(`Failed to compile expression: ${str}`);
        }
    }

    printError () {
        this._Module._Parser_PrintError(this._parserRef);
        this._Module.exprtkcore.flush();
    }
}

export class Exprtk {
    constructor (Module) {
        this._Module = Module;
    }

    createSymbolTable () {
        const symbolTableRef = this._Module._SymbolTable_Create();
        const ret = new SymbolTable(this._Module, symbolTableRef);
        this._Module.exprtkcore.flush();
        return ret;
    }

    createExpression () {
        const expressionRef = this._Module._Expression_Create();
        const ret = new Expression(this._Module, expressionRef);
        this._Module.exprtkcore.flush();
        return ret;
    }

    createParser () {
        const parserRef = this._Module._Parser_Create();
        const ret = new Parser(this._Module, parserRef);
        this._Module.exprtkcore.flush();
        return ret;
    }
}

const createModule = function () {
    const Module = {};
    Module.arguments = ['--exit'],
    Module.exprtkcore = {
        ENVIRONMENT_IS_WEB: typeof window === 'object',
        ENVIRONMENT_IS_WORKER: typeof importScripts === 'function',
        ENVIRONMENT_IS_NODE: typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string',
        wasmUrl: '',
        flush: undefined
    };

    Module.locateFile = function (path, prefix) {
        if (path.endsWith('.wasm')) {
            return Module.exprtkcore.wasmUrl;
        }
        return prefix + path;
    };

    if (Module.exprtkcore.ENVIRONMENT_IS_NODE) {
        Module.quit = function (status, toThrow) {
            throw toThrow;
        };
    }
    return Module;
};

export const createExprtk = async function () {
    const Module = await exprtkcore(createModule());
    const ret = new Exprtk(Module);
    Module.exprtkcore.flush();
    return ret;
};
