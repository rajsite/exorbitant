// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

const {createExorbitantRuntime} = require('../../dist/exorbitant.umd.js');
(async function () {
    const exorbitantRuntime = await createExorbitantRuntime();
    const exorbitant = exorbitantRuntime.createExorbitant({
        expression: 'var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);'
    });
    var ret = exorbitant.calculateValue();
    console.log(`ret: ${ret}`);
}()).catch(ex => console.log(ex));
