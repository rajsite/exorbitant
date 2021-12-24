// Copyright (c) 2021 Milan Raj
// SPDX-License-Identifier: MIT

// Used in pre.js
// eslint-disable-next-line no-unused-vars
let exprtkWasmUrl;

(() => {
    const ENVIRONMENT_IS_WEB = typeof window === 'object';
    const ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';

    if (ENVIRONMENT_IS_WEB) {
        exprtkWasmUrl = new URL('exprtkcore.wasm', import.meta.url).toString();
    } else if (ENVIRONMENT_IS_NODE) {
        exprtkWasmUrl = `${__dirname}/exprtkcore.wasm`;
    }
})();
