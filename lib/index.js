'use strict';

const chalk = require('chalk');
const log = require('fancy-log');
const PluginError = require('plugin-error');
const semver = require('semver');
const through = require('through2');

const utils = require('./utils');
const pluginName = 'gulp-vsts-bump';

/**
 * Helper function for creating PluginErrors.
 *
 * @param {string} errorMessage - The error message to specify.
 * @param {PluginError<T = {}>.Options} options - The additional options for the PluginError
 *
 * @returns {PluginError}
 */
const createPluginError = (errorMessage, options) => {
    return new PluginError(pluginName, errorMessage, options);
};

/**
 * Logs the output of the bumping process.
 *
 * @param {Object} opts - The options for the plugin.
 * @param {string} initialVersion - The original version of the task.
 * @param {string} bumpedVersion  - The bumped version of the task.
 */
const logOutput = (opts, initialVersion, bumpedVersion) => {
    if (opts.quiet === true) {
        return;
    }

    const oldVersionMessage = 'Bumped ' + chalk.blue(initialVersion);
    const newVersionMessage = ' to ' + chalk.magenta(bumpedVersion);
    const bumpTypeMessage = ' with type: ' + chalk.blue(opts.type);
    log.info(oldVersionMessage + newVersionMessage + bumpTypeMessage);
};

/**
 * Updates the file with the new version value.
 *
 * @param {Object} opts - The options for the plugin.
 * @param {Object} file - The file to validate.
 * @param {callback} cb - The callback function.
 * @param {Object} json - The object representation of the file.
 * @param {string} initialVersion - The original version of the file.
 */
const updateFile = (opts, file, cb, json, initialVersion) => {
    try {
        const bumpedVersion = utils.bumpVersion(json, initialVersion, opts);
        file.contents = new Buffer(JSON.stringify(json, null, opts.indent));
        logOutput(opts, initialVersion, bumpedVersion);

        return cb(null, file);
    } catch (err) {
        return cb(
            createPluginError('Error bumping version', {
                fileName: file.path,
                showStack: true
            })
        );
    }
};

/**
 * Parses the file.
 *
 * @param {Object} opts - The options for the plugin.
 * @param {Object} file - The file to validate.
 * @param {callback} cb - The callback function.
 */
const parseFile = (opts, file, cb) => {
    const content = String(file.contents);
    let json;
    let initialVersion;

    try {
        json = JSON.parse(content);
        initialVersion = utils.getTaskVersion(json);
    } catch (e) {
        return cb(createPluginError('Error parsing JSON file'));
    }

    if (!semver.valid(initialVersion)) {
        return cb(
            createPluginError(
                'Task manifest file contains an invalid version specification: ' +
                    initialVersion
            )
        );
    }

    return updateFile(opts, file, cb, json, initialVersion);
};

/**
 * Helper function that processes the file.
 *
 * @param {Object} opts - The options for the plugin.
 * @param {Object} file - The file to validate.
 * @param {callback} cb - The callback function.
 */
const processFile = (opts, file, cb) => {
    if (file.isNull()) {
        return cb(null, file);
    }

    if (file.isStream()) {
        return cb(createPluginError('Streaming not supported'));
    }

    return parseFile(opts, file, cb);
};

/**
 * The core bumping function.
 *
 * @param {Object} opts - The options for this plugin.
 * @returns {Stream}
 */
const bump = (opts) => {
    const options = utils.validateOptions(opts);

    return through.obj((file, _enc, cb) => {
        return processFile(options, file, cb);
    });
};

module.exports = bump;
