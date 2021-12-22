'use strict';
const fs = require('fs');
const path = require('path');
const { WASI } = require('wasi');
const fd = fs.openSync(path.resolve(__dirname, 'fixture/simple.txt'), 'r');
const wasi = new WASI({
    args: process.argv,
    stdin: fd
});
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

// TODO readline isn't blocking?

(async () => {
    const wasm = await WebAssembly.compile(fs.readFileSync(path.resolve(__dirname, '../../dist/exprtk.wasm')));
    const instance = await WebAssembly.instantiate(wasm, importObject);

    wasi.start(instance);
})();
