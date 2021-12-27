import * as Comlink from '../dist/vendor/comlink.js';

// Workaround to support running as an es6 module. The ralative path is the same for both:
// 1. Running from exorbitant.js from in source
// 2. Running from exorbitant.js from in dist
const exorbitantWorkerUrl = new URL('../dist/exorbitant-worker.js', import.meta.url);

class ExorbitantRuntimeProxy {
    constructor () {
        this._exorbitantRuntimeWorker = undefined;
    }

    async createExorbitant (configuration) {
        if (this._exorbitantRuntimeWorker === undefined) {
            // Creates a new worker for each exorbitant runtime so the wasm module is not loaded twice in the same worker
            const worker = new Worker(exorbitantWorkerUrl);
            const createExorbitantRuntimeWorker = Comlink.wrap(worker);
            this._exorbitantRuntimeWorker = await createExorbitantRuntimeWorker();
        }
        const exorbitant = await this._exorbitantRuntimeWorker.createExorbitant(configuration);
        return exorbitant;
    }
}

export const createExorbitantRuntime = function () {
    return new ExorbitantRuntimeProxy();
};
