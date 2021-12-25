import * as Comlink from '../dist/vendor/comlink.js';

// Workaround to support running as an es6 module. The ralative path is the same for both:
// 1. Running from exorbitant.js from in source
// 2. Running from exorbitant.js from in dist
const exorbitantWorkerUrl = new URL('../dist/exorbitant-worker.js', import.meta.url);

export class ExorbitantRuntime {
    constructor () {
        this._worker = undefined;
        this._exorbitantRuntimeRemote = undefined;
    }

    async createExorbitant (configuration) {
        if (this._worker === undefined) {
            this._worker = new Worker(exorbitantWorkerUrl);
        }
        if (this._exorbitantRuntimeRemote === undefined) {
            const ExorbitantRuntimeRemote = Comlink.wrap(this._worker);
            this._exorbitantRuntimeRemote = await new ExorbitantRuntimeRemote();
        }
        const exorbitant = await this._exorbitantRuntimeRemote.createExorbitant(configuration);
        return exorbitant;
    }
}
