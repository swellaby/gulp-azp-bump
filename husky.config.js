'use strict';

module.exports = {
    hooks: {
        'pre-commit': 'npm run build'
    }
};

// module.exports = {
//     husky: {
//         hooks: {
//             'pre-commit': 'npm run build'
//         }
//     }
// };