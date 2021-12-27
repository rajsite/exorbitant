// Copyright (c) 2021 Milan Raj
// SPDX-License-Identifier: MIT

// exprtkcore generated by emscripten with named default export
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import exprtkcore from '../dist/exprtkcore.js';

// Make sure to use Module.stackSave() before calling
const writeStringToStack = function (Module, str) {
    // Algorithm from emscripten ccall toC string
    // eslint-disable-next-line no-bitwise
    const strMaxStackLength = (str.length << 2) + 1;
    const strStackPointer = Module.stackAlloc(strMaxStackLength);
    Module.stringToUTF8(str, strStackPointer, strMaxStackLength);
    return strStackPointer;
};

class Variable {
    constructor (Module, symbolTableRef, name) {
        const variableRef = Module._malloc(8);
        if (variableRef === 0) {
            throw new Error(`Not enough memory to allocate variable ${name}.`);
        }
        const stack = Module.stackSave();
        const nameRef = writeStringToStack(Module, name);
        const result = Module._SymbolTable_AddVariable(symbolTableRef, nameRef, variableRef);
        Module.stackRestore(stack);
        Module.exprtkcore.flush();
        if (!result) {
            throw new Error(`Failed to create variable with name ${name}`);
        }
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

class Vector {
    constructor (Module, symbolTableRef, name, size) {
        const vectorRef = Module._malloc(size * 8);
        if (vectorRef === 0) {
            throw new Error(`Not enough memory to allocate vector ${name} with size ${size}.`);
        }
        const stack = Module.stackSave();
        const nameRef = writeStringToStack(Module, name);
        const result = Module._SymbolTable_AddVector(symbolTableRef, nameRef, vectorRef, size);
        Module.stackRestore(stack);
        Module.exprtkcore.flush();
        if (!result) {
            throw new Error(`Failed to create vector with name ${name}`);
        }
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

class SymbolTable {
    constructor (Module) {
        this._Module = Module;
        this._symbolTableRef = this._Module._SymbolTable_Create();
        this._Module.exprtkcore.flush();
    }

    addConstants () {
        const result = this._Module._SymbolTable_AddConstants(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddConstants');
        }
    }

    addPackageIO () {
        const result = this._Module._SymbolTable_AddPackageIO(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddPackageIO');
        }
    }

    addPackageVecops () {
        const result = this._Module._SymbolTable_AddPackageVecops(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AppPackageVecops');
        }
    }

    addPackageArmadillo () {
        const result = this._Module._SymbolTable_AddPackageArmadillo(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddPackageArmadillo');
        }
    }

    addPackageSigpack () {
        const result = this._Module._SymbolTable_AddPackageSigpack(this._symbolTableRef);
        this._Module.exprtkcore.flush();
        if (!result) {
            throw new Error('Failed to SymbolTable::AddPackageSigpack');
        }
    }

    createVariable (name) {
        return new Variable(this._Module, this._symbolTableRef, name);
    }

    createVector (name, size) {
        return new Vector(this._Module, this._symbolTableRef, name, size);
    }
}

class Expression {
    constructor (Module) {
        this._Module = Module;
        this._expressionRef = this._Module._Expression_Create();
        this._Module.exprtkcore.flush();
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

class Parser {
    constructor (Module) {
        this._Module = Module;
        this._parserRef = this._Module._Parser_Create();
        this._Module.exprtkcore.flush();
    }

    compile (str, expression) {
        const stack = this._Module.stackSave();
        const strRef = writeStringToStack(this._Module, str);
        const result = this._Module._Parser_Compile(this._parserRef, strRef, expression._expressionRef);
        this._Module.stackRestore(stack);
        this._Module.exprtkcore.flush();
        if (!result) {
            // TODO instead of printing should pass error in exception
            this._Module._Parser_PrintError(this._parserRef);
            this._Module.exprtkcore.flush();
            throw new Error(`Failed to compile expression: ${str}`);
        }
    }
}

class Exprtk {
    constructor (Module) {
        this._Module = Module;
    }

    createSymbolTable () {
        return new SymbolTable(this._Module);
    }

    createExpression () {
        return new Expression(this._Module);
    }

    createParser () {
        return new Parser(this._Module);
    }
}

const createModule = function () {
    const Module = {};
    Module.arguments = ['--exit'];
    Module.exprtkcore = {
        ENVIRONMENT_IS_WEB: typeof window === 'object',
        ENVIRONMENT_IS_WORKER: typeof importScripts === 'function',
        ENVIRONMENT_IS_NODE: typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string',
        wasmUrl: '',
        flush: undefined
    };

    Module.locateFile = (path, prefix) => {
        if (path.endsWith('.wasm')) {
            return Module.exprtkcore.wasmUrl;
        }
        return prefix + path;
    };

    if (Module.exprtkcore.ENVIRONMENT_IS_NODE) {
        Module.quit = (_status, toThrow) => {
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
