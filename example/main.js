import createExorbitant from '../source/exorbitant.js';
window.createExorbitant = createExorbitant;

(async function () {
    const exor = await createExorbitant();
    const symbolTable = exor.createSymbolTable();
}());
