import * as Comlink from '../dist/vendor/comlink.js';
import { createExorbitantRuntime } from './exorbitant-in-process.js';

class ExorbitantRuntimeWorker {
    constructor () {
        this._exorbitantRuntime = undefined;
    }

    async createExorbitant (configuration) {
        if (this._exorbitantRuntime === undefined) {
            this._exorbitantRuntime = createExorbitantRuntime();
        }
        const exorbitant = await this._exorbitantRuntime.createExorbitant(configuration);
        return Comlink.proxy(exorbitant);
    }
}

const createExorbitantRuntimeWorker = function () {
    const exorbitantRuntimeWorker = new ExorbitantRuntimeWorker();
    return Comlink.proxy(exorbitantRuntimeWorker);
};

Comlink.expose(createExorbitantRuntimeWorker);
