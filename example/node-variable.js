// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

const {createExprtk} = require('../dist/exorbitant.umd.js');
(async function () {
    const exprtk = await createExprtk();
    const symbolTable = exprtk.createSymbolTable();
    const a = symbolTable.createVariable('a');
    const b = symbolTable.createVariable('b');

    const expression = exprtk.createExpression();
    const parser = exprtk.createParser();

    expression.registerSymbolTable(symbolTable);
    var compileRet = parser.compile(`a+b`, expression);
    console.log(`compiled?: ${compileRet}`);

    a.value = 0;
    b.value = 0;
    var ret = expression.value();
    console.log(`ret (expect 0): ${ret}`);

    a.value = 2;
    b.value = 4;
    var ret = expression.value();
    console.log(`ret (expect 6): ${ret}`);

}()).catch(ex => console.log(ex));
