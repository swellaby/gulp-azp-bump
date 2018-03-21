'use strict';

const plugin = require('./plugin');

const bumpVstsTasks = (opts) => {
    return plugin.bump(opts);
};

module.exports = bumpVstsTasks;