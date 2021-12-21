'use strict';
const fs = require('fs');
const path = require('path');
const { WASI } = require('wasi');
const wasi = new WASI({
    args: process.argv
});
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

// TODO readline isn't blocking?

(async () => {
  const wasm = await WebAssembly.compile(fs.readFileSync(path.resolve(__dirname, '../dist/exorbitant.wasm')));
  const instance = await WebAssembly.instantiate(wasm, importObject);

  wasi.start(instance);
})();
