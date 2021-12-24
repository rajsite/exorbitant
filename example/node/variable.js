// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

const { createExorbitantRuntime } = require('../../dist/exorbitant.umd.js');

(async () => {
    const exorbitantRuntime = await createExorbitantRuntime();
    const exorbitant = exorbitantRuntime.createExorbitant({
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
