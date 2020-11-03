import exorbitant from '../dist/exorbitant.js';

// Make sure to use Module.stackSave() before calling
const writeStringToStack = function (Module, str) {
    var strMaxStackLength = (str.length << 2) + 1;
    var strStackPointer = Module.stackAlloc(strMaxStackLength);
    Module.stringToUTF8(str, strStackPointer, strMaxStackLength);
    return strStackPointer;
};

class SymbolTable {
    constructor (Module, symbolTableRef) {
        this._Module = Module;
        this._symbolTableRef = symbolTableRef;
    }
}

class Expression {
    constructor (Module, expressionRef) {
        this._Module = Module;
        this._expressionRef = expressionRef;
    }

    registerSymbolTable (symbolTable) {
        this._Module._Expression_RegisterSymbolTable(this._expressionRef, symbolTable._symbolTableRef);
    }

    value () {
        const ret = this._Module._Expression_Value(this._expressionRef);
        this._Module.flushBuffer();
        return ret;
    }
}

class Parser {
    constructor (Module, parserRef) {
        this._Module = Module;
        this._parserRef = parserRef;
    }

    compile (str, expression) {
        const stack = this._Module.stackSave();
        const strPtr = writeStringToStack(this._Module, str);
        const ret = this._Module._Parser_Compile(this._parserRef, strPtr, expression._expressionRef);
        this._Module.stackRestore(stack);
        return ret;
    }
}

class Exorbitant {
    constructor (Module) {
        this._Module = Module;
    }

    createSymbolTable () {
        const symbolTableRef = this._Module._SymbolTable_Create();
        return new SymbolTable(this._Module, symbolTableRef);
    }

    createExpression () {
        const expressionRef = this._Module._Expression_Create();
        return new Expression(this._Module, expressionRef);
    }

    createParser () {
        const parserRef = this._Module._Parser_Create();
        return new Parser(this._Module, parserRef);
    }
}

const createExorbitant = async function () {
    let buffer = [];
    const ModuleRef = {
        Module: undefined
    };
    const ModuleInit = {
        stdout: function (val) {
            if (val === null || val === 10) {
                console.log(ModuleRef.Module.UTF8ArrayToString(buffer, 0));
                buffer = [];
            } else {
                if (val != 0) buffer.push(val);
            }
        },
        arguments: ['--exit']
    };
    const Module = await exorbitant(ModuleInit);
    ModuleRef.Module = Module;
    Module.flushBuffer = () => {
        console.log(ModuleRef.Module.UTF8ArrayToString(buffer, 0));
        buffer = [];
    };
    return new Exorbitant(Module);
};

export default createExorbitant;
