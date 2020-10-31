import exorbitant from '../dist/exorbitant.js';

class SymbolTable {
    constructor (symbolTable) {
        this._symbolTable = symbolTable;
    }
}

class Exorbitant {
    constructor (exorbitant) {
        this._exorbitant = exorbitant;
    }

    createSymbolTable () {
        const symbolTable = this._exorbitant.createSymbolTable();
        return new SymbolTable(symbolTable);
    }
}

const createExorbitant = async function () {
    const exor = await exorbitant();
    return new Exorbitant(exor);
};

export default createExorbitant;
