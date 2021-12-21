// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

let exorbitantWasmUrl;

(function () {
    var ENVIRONMENT_IS_WEB = typeof window === 'object';
    var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
    var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
    
    if (ENVIRONMENT_IS_WEB) {
        exorbitantWasmUrl = new URL('exorbitant.wasm', import.meta.url).toString();
    } else if (ENVIRONMENT_IS_NODE) {
        exorbitantWasmUrl = __dirname + '/exorbitant.wasm';
    }
})();
