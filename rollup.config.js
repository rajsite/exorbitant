// eslint-disable-next-line import/no-default-export
export default [
    {
        input: 'source/exorbitant-in-process.js',
        output: {
            file: 'dist/exorbitant-in-process.js',
            format: 'umd',
            name: 'exorbitant'
        }
    },
    {
        input: 'source/exorbitant-worker.js',
        output: {
            file: 'dist/exorbitant-worker.js',
            format: 'iife'
        }
    },
    {
        input: 'source/exorbitant.js',
        output: {
            file: 'dist/exorbitant.js',
            format: 'umd',
            name: 'exorbitant'
        }
    }
];
