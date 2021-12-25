import * as Comlink from '../dist/vendor/comlink.js';
import { ExorbitantRuntime as ExorbitantRuntimeInProcess } from './exorbitant-in-process.js';

class ExorbitantRuntime {
    constructor () {
        this._exorbitantRuntimeInProcess = new ExorbitantRuntimeInProcess();
    }

    async createExorbitant (configuration) {
        const exorbitant = await this._exorbitantRuntimeInProcess.createExorbitant(configuration);
        return Comlink.expose(exorbitant);
    }
}

Comlink.expose(ExorbitantRuntime);
