import * as Comlink from '../dist/vendor/comlink.js';
import { ExorbitantRuntime } from './exorbitant-in-process.js';

class ExorbitantRuntimeWorker {
    constructor () {
        this._exorbitantRuntime = undefined;
    }

    async createExorbitant (configuration) {
        if (this._exorbitantRuntime === undefined) {
            this._exorbitantRuntime = new ExorbitantRuntime();
        }
        const exorbitant = await this._exorbitantRuntime.createExorbitant(configuration);
        return Comlink.proxy(exorbitant);
    }
}

Comlink.expose(ExorbitantRuntimeWorker);
