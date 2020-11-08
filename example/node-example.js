const {createExorbitant} = require('../dist/exorbitant.umd.js');
(async function () {
    const exorbitant = await createExorbitant();
    const symbolTable = exorbitant.createSymbolTable();
    const expression = exorbitant.createExpression();
    const parser = exorbitant.createParser();

    expression.registerSymbolTable(symbolTable);
    var compileRet = parser.compile(`var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);`, expression);
    console.log(`compiled?: ${compileRet}`);
    var ret = expression.value();
    console.log(`ret: ${ret}`);
}()).catch(ex => console.log(ex));
