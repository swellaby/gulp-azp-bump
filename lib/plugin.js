'use strict';

const chalk = require('chalk');
const log = require('fancy-log');
const PluginError = require('plugin-error');
const semver = require('semver');
const through = require('through2');

const pluginName = 'gulp-vsts-bump';
const defaultReleaseType = 'patch';

/**
 * Helper function for setting a valid release type.
 * @param {Object} opts - The options for this plugin.
 */
const validateReleaseType = (opts) => {
    if (!opts.type || !semver.inc('1.0.0', opts.type)) {
        opts.type = defaultReleaseType;
    }
};

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
 * Extracts the version of the task.
 *
 * @param {Object} task - The object representation of the task.
 * @returns {string}
 */
const getVersion = (task) => {
    const version = task.version;
    const major = version.Major;
    const minor = version.Minor;
    const patch = version.Patch;
    const dot = '.';

    return major + dot + minor + dot + patch;
};

/**
 * Bumps the task's version using the specified release type.
 * 
 * @param {Object} task - The object representation of the task.
 * @param {string} currentVersion - The current version of the task.
 * @param {string} releaseType - The type of version to bump.
 *
 * @returns {string} - The bumped version of the specified version.
 */
const bumpVersion = (task, currentVersion, releaseType) => {
    const bumpedVersion = semver.inc(currentVersion, releaseType);
    task.version.Major = semver.major(bumpedVersion).toString();
    task.version.Minor = semver.minor(bumpedVersion).toString();
    task.version.Patch = semver.patch(bumpedVersion).toString();
    return bumpedVersion;
};

/**
 * Logs the output of the bumping process.
 *
 * @param {Object} opts - The options for the plugin.
 * @param {string} initialVersion - The original version of the task.
 * @param {string} bumpedVersion  - The bumped version of the task.
 */
const logOutput = (opts, initialVersion, bumpedVersion) => {
    if (!opts.quiet) {
        const oldVersionMessage = 'Bumped ' + chalk.blue(initialVersion);
        const newVersionMessage = ' to ' + chalk.magenta(bumpedVersion);
        const bumpTypeMessage = ' with type: ' + chalk.blue(opts.type);
        log.info(oldVersionMessage + newVersionMessage + bumpTypeMessage);
    }
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
        const bumpedVersion = bumpVersion(json, initialVersion, opts.type);
        file.contents = new Buffer(JSON.stringify(json));
        logOutput(opts, initialVersion, bumpedVersion);
    
        return cb(null, file);
    } catch (err) {
        return cb(createPluginError('Error bumping version', { fileName: file.path, showStack: true }));
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
        initialVersion = getVersion(json);
    } catch (e) {
        return cb(createPluginError('Error parsing JSON file', { fileName: file.path, showStack: true }));
    }

    if (!semver.valid(initialVersion)) {
        return cb(createPluginError('Task manifest file contains an invalid version specification: ' + initialVersion));
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
    opts = opts || {};
    validateReleaseType(opts);
    
    return through.obj((file, enc, cb) => {
        return processFile(opts, file, cb);
    });
};

module.exports.bump = bump;