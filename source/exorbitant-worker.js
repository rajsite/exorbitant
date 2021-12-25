// importScripts('comlink');
// importScripts('./exorbitant-in-process.js');

// const ExorbitantRuntimeInProcess = self.exorbitant.ExorbitantRuntime;
// const Comlink = self.Comlink;

// class ExorbitantRuntime {
//     constructor () {
//         this._exorbitantRuntimeInProcess = new ExorbitantRuntimeInProcess();
//     }

//     async createExorbitant (configuration) {
//         const exorbitant = await this._exorbitantRuntimeInProcess.createExorbitant(configuration);
//         return Comlink.expose(exorbitant);
//     }
// }

// Comlink.expose(ExorbitantRuntime);
