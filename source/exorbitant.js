// import * as Comlink from 'comlink';

// const exorbitantWorkerUrl = new URL('./exorbitant-worker.js', import.meta.url);

// export class ExorbitantRuntime {
//     constructor () {
//         this._worker = undefined;
//         this._exorbitantRuntimeRemote = undefined;
//     }

//     async createExorbitant (configuration) {
//         if (this._worker === undefined) {
//             this._worker = new Worker(exorbitantWorkerUrl);
//         }
//         if (this._exorbitantRuntimeRemote === undefined) {
//             const ExorbitantRuntimeRemote = Comlink.wrap(this._worker);
//             this._exorbitantRuntimeRemote = await new ExorbitantRuntimeRemote();
//         }
//         const exorbitant = await this._exorbitantRuntimeRemote.createExorbitant(configuration);
//         return exorbitant;
//     }
// }
