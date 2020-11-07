const createExorbitant = require('../dist/exorbitant.umd.js');
(async function () {
    const exorbitant = await createExorbitant();
    const symbolTable = exorbitant.createSymbolTable();
    const data = symbolTable.addVector('data', 3);

    const expression = exorbitant.createExpression();
    const parser = exorbitant.createParser();

    expression.registerSymbolTable(symbolTable);
    var compileRet = parser.compile(`sum(data)`, expression);
    console.log(`compiled?: ${compileRet}`);

    var ret = expression.value();
    console.log(`ret (expect 0): ${ret}`);

    data[0] = 1;
    data[1] = 2;
    data[2] = 3;
    var ret = expression.value();
    console.log(`ret (expect 6): ${ret}`);

}()).catch(ex => console.log(ex));
