// Copyright (c) 2021 Milan Raj
// SPDX-License-Identifier: MIT

const { createExorbitantRuntime } = require('../../dist/exorbitant-in-process.js');

(async () => {
    const exorbitantRuntime = createExorbitantRuntime();
    const exorbitant = await exorbitantRuntime.createExorbitant({
        expression: 'var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);'
    });
    const ret = exorbitant.value();
    console.log(`ret: ${ret}`);
    exorbitant.destroy();
    exorbitantRuntime.destroy();
})().catch(ex => console.log(ex));
