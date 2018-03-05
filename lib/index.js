'use strict';

const plugin = require('./plugin');

const bumpVstsTask = (opts) => {
    return plugin.bump(opts);
};

module.exports = bumpVstsTask;