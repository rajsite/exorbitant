import createExorbitant from '../source/exorbitant.js';
window.createExorbitant = createExorbitant;

(async function () {
    const exorbitant = await createExorbitant();
    const symbolTable = exorbitant.createSymbolTable();
    const expression = exorbitant.createExpression();
    const parser = exorbitant.createParser();

    expression.registerSymbolTable(symbolTable);
    var compileRet = parser.compile(`1+1; 3+4;print(6);5+2;`, expression);
    console.log(`compiled?: ${compileRet}`);
    var ret = expression.value();
    console.log(`ret: ${ret}`);
}());
