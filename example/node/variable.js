// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

const {createExorbitantRuntime} = require('../../dist/exorbitant.umd.js');
(async function () {
    const exorbitantRuntime = await createExorbitantRuntime();
    const exorbitant = exorbitantRuntime.createExorbitant({
        expression: 'a+b',
        symbolTable: {
            variables: [
                {
                    name: 'a',
                    value: 0
                },
                {
                    name: 'b',
                    value: 0
                }
            ]
        }
    });
    var ret = exorbitant.calculateValue();
    console.log(`ret (expect 0): ${ret}`);

    exorbitant.setVariable('a', 2);
    exorbitant.setVariable('b', 4);

    var ret = exorbitant.calculateValue();
    console.log(`ret (expect 6): ${ret}`);

}()).catch(ex => console.log(ex));
