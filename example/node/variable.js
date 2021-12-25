// Copyright (c) 2021 Milan Raj
// SPDX-License-Identifier: MIT

const { ExorbitantRuntime } = require('../../dist/exorbitant-in-process.umd.js');

(async () => {
    const exorbitant = await new ExorbitantRuntime().createExorbitant({
        expression: 'a+b',
        symbolTable: {
            variables: [
                { name: 'a', value: 0 },
                { name: 'b', value: 0 }
            ]
        }
    });
    const ret1 = exorbitant.value();
    console.log(`ret (expect 0): ${ret1}`);

    exorbitant.setVariable('a', 2);
    exorbitant.setVariable('b', 4);

    const ret2 = exorbitant.value();
    console.log(`ret (expect 6): ${ret2}`);
})().catch(ex => console.log(ex));
