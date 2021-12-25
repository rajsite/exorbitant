// Copyright (c) 2021 Milan Raj
// SPDX-License-Identifier: MIT

const { createExprtk } = require('../../dist/exorbitant-in-process.js');

(async () => {
    const exprtk = await createExprtk();
    const symbolTable = exprtk.createSymbolTable();
    const dataVector = symbolTable.createVector('data', 3);

    const expression = exprtk.createExpression();
    const parser = exprtk.createParser();

    expression.registerSymbolTable(symbolTable);
    parser.compile('sum(data)', expression);

    dataVector.assign([0, 0, 0]);
    const ret1 = expression.value();
    console.log(`ret (expect 0): ${ret1}`);

    let data = dataVector.createBufferView();
    data[0] = 1;
    data[1] = 2;
    data[2] = 3;
    data = undefined;
    const ret2 = expression.value();
    console.log(`ret (expect 6): ${ret2}`);
})().catch(ex => console.log(ex));
