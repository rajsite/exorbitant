import exorbitant from '../dist/exorbitant.js';

class SymbolTable {
    constructor (Module, symbolTable) {
        this._Module = Module;
        this._symbolTable = symbolTable;
    }
}

class Expression {
    constructor (Module, expression) {
        this._Module = Module;
        this._expression = expression;
    }

    registerSymbolTable (symbolTable) {
        this._Module._Expression_RegisterSymbolTable(this._expression, symbolTable._symbolTable);
    }

    value () {
        return this._Module._Expression_Value(this._expression);
    }
}

class Parser {
    constructor (Module, parser) {
        this._Module = Module;
        this._parser = parser;
    }

    compile (str, expression) {
        const stack = this._Module.stackSave();
        const strPtr = this._Module.writeJSStringToStack(str);
        const ret = this._Module._Parser_Compile(this._parser, strPtr, expression._expression);
        this._Module.stackRestore(stack);
        return ret;
    }
}

class Exorbitant {
    constructor (Module) {
        this._Module = Module;
    }

    createSymbolTable () {
        const symbolTable = this._Module._SymbolTable_Create();
        return new SymbolTable(this._Module, symbolTable);
    }

    createExpression () {
        const expression = this._Module._Expression_Create();
        return new Expression(this._Module, expression);
    }

    createParser () {
        const parser = this._Module._Parser_Create();
        return new Parser(this._Module, parser);
    }
}

const createExorbitant = async function () {
    const Module = await exorbitant();

    Module.writeJSStringToStack = function (str) {
        var strMaxStackLength = (str.length << 2) + 1;
        var strStackPointer = Module.stackAlloc(strMaxStackLength);
        Module.stringToUTF8(str, strStackPointer, strMaxStackLength);
        return strStackPointer;
    };

    return new Exorbitant(Module);
};

export default createExorbitant;
