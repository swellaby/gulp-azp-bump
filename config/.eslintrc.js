'use strict';

module.exports = {
    env: {
        commonjs: true,
        node: true,
        mocha: true,
        es6: true,
    },
    extends: 'eslint:recommended',
    rules: {
        indent: [
            'error',
            4,
            {
                "SwitchCase": 1
            }
        ],
        'linebreak-style': [
            'off'
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ],
        'no-console': [
            'off'
        ],
        'max-statements': [
            'error',
            {
                'max': 12
            },
            {
                'ignoreTopLevelFunctions': true
            }
        ],
        'require-yield': [
            'off'
        ],
        strict: [
            'error',
            'global'
        ],
        'no-trailing-spaces': [
           'error' 
        ]
    }
}