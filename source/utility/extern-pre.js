// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

let exprtkWasmUrl;

(function () {
    var ENVIRONMENT_IS_WEB = typeof window === 'object';
    var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
    var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';

    if (ENVIRONMENT_IS_WEB) {
        exprtkWasmUrl = new URL('exprtk.wasm', import.meta.url).toString();
    } else if (ENVIRONMENT_IS_NODE) {
        exprtkWasmUrl = __dirname + '/exprtk.wasm';
    }
})();
