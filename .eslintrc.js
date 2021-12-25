module.exports = {
    extends: '@ni/eslint-config-javascript',
    rules: {
        'import/extensions': 'off',
        'max-classes-per-file': 'off',
        'space-before-function-paren': ['error', 'always']
    },
    overrides: [
        {
            files: ['source/*.js'],
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2020
            },
            env: {
                browser: true
            }
        },
        {
            files: ['example/**/*.js'],
            rules: {
                'no-console': 'off',
            }
        },
        {
            files: ['example/node/*.js'],
            env: {
                node: true
            }
        },
        {
            files: ['source/utility/*.js'],
            globals: {
                Module: false
            },
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2020
            }
        }
    ]
};
