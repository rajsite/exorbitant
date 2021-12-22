// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

const {createExprtk} = require('../../dist/exorbitant.umd.js');
(async function () {
    const exprtk = await createExprtk();
    const symbolTable = exprtk.createSymbolTable();
    const dataVector = symbolTable.createVector('data', 3)

    const expression = exprtk.createExpression();
    const parser = exprtk.createParser();

    expression.registerSymbolTable(symbolTable);
    var compileRet = parser.compile(`sum(data)`, expression);
    parser.printError();
    console.log(`compiled?: ${compileRet}`);

    dataVector.assign([0,0,0]);
    var ret = expression.value();
    console.log(`ret (expect 0): ${ret}`);

    let data = dataVector.createBufferView();
    data[0] = 1;
    data[1] = 2;
    data[2] = 3;
    data = undefined;
    var ret = expression.value();
    console.log(`ret (expect 6): ${ret}`);

}()).catch(ex => console.log(ex));
