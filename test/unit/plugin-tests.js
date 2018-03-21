'use strict';

const Chai = require('chai');
const chalk = require('chalk');
const log = require('fancy-log');
const semver = require('semver');
const Sinon = require('sinon');
const through = require('through2');

const helpers = require('../helpers');
const plugin = require('../../lib/plugin');
const assert = Chai.assert;

suite('plugin Suite:', () => {
    const sandbox = Sinon.sandbox.create();
    let opts;
    let fileStub;
    let callback;
    let semverIncStub;
    let semverValidStub;
    let semverMajorStub;
    let semverMinorStub;
    let semverPatchStub;
    let throughObjStub;
    let fileIsNullStub;
    let fileIsStreamStub;
    let jsonParseStub;
    let jsonStringifySpy;
    let logInfoStub;

    const stubSemverFunctions = () => {
        semverIncStub = sandbox.stub(semver, 'inc').callsFake(() => helpers.bumpedVersion);
        semverValidStub = sandbox.stub(semver, 'valid').callsFake(() => { return true; });
        semverMajorStub = sandbox.stub(semver, 'major').callsFake(() => helpers.majorVersion);
        semverMinorStub = sandbox.stub(semver, 'minor').callsFake(() => helpers.minorVersion);
        semverPatchStub = sandbox.stub(semver, 'patch').callsFake(() => helpers.patchVersion);
    };

    setup(() => {
        opts = { quiet: true };
        fileStub = helpers.validSampleOneTaskFile;
        stubSemverFunctions();
        throughObjStub = sandbox.stub(through, 'obj');
        fileIsNullStub = sandbox.stub(fileStub, 'isNull').callsFake(() => false);
        fileIsStreamStub = sandbox.stub(fileStub, 'isStream').callsFake(() => false);
        jsonParseStub = sandbox.stub(JSON, 'parse').callsFake(() => { return helpers.validSampleOneTaskContents; });
        jsonStringifySpy = sandbox.spy(JSON, 'stringify');
        logInfoStub = sandbox.stub(log, 'info');
    });

    teardown(() => {
        sandbox.restore();
        opts = null;
        fileStub = null;
    });

    suite('Default options Suite:', () => {
        const throughStub = {};

        setup(() => {
            throughObjStub.callsFake(() => throughStub);
        });

        test('Should set release type to default if no type is specified', () => {
            plugin.bump(opts);
            assert.deepEqual(opts.type, helpers.defaultReleaseType);
        });

        test('Should set release type to default if invalid type is specified', () => {
            opts.type = 'bad';
            semverIncStub.callsFake(() => false);
            plugin.bump(opts);
            assert.deepEqual(opts.type, helpers.defaultReleaseType);
        });

        test('Should use specified release type when patch type is specified', () => {
            opts.type = helpers.patchReleaseType;
            plugin.bump(opts);
            assert.deepEqual(opts.type, helpers.patchReleaseType);
        });

        test('Should use specified release type when minor type is specified', () => {
            opts.type = helpers.minorReleaseType;
            plugin.bump(opts);
            assert.deepEqual(opts.type, helpers.minorReleaseType);
        });

        test('Should use specified release type when major type is specified', () => {
            opts.type = helpers.majorReleaseType;
            plugin.bump(opts);
            assert.deepEqual(opts.type, helpers.majorReleaseType);
        });

        test('Should return a stream', () => {
            const stream = plugin.bump();
            assert.isTrue(throughObjStub.called);
            assert.deepEqual(stream, throughStub);
        });
    });

    suite('File validation Suite:', () => {
        setup(() => {
            throughObjStub.yields(fileStub, null, callback);
        });

        teardown(() => {
            callback = null;
        });

        test('Should invoke the callback with the file when the file is null', (done) => {
            callback = (err, data) => {
                assert.isNull(err);
                assert.deepEqual(data, fileStub);
                assert.isTrue(fileIsNullStub.called);
                assert.isFalse(fileIsStreamStub.called);
                done();
            };
            fileIsNullStub.callsFake(() => true);
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should invoke the callback with a plugin error when the file is a stream', (done) => {
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, 'Streaming not supported');
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(fileIsNullStub.called);
                assert.isTrue(fileIsStreamStub.called);
                done();
            };
            fileIsStreamStub.callsFake(() => true);
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });
    });

    suite('File parsing errors Suite:', () => {
        test('Should invoke the callback with an error when the file parse fails', (done) => {
            jsonParseStub.throws(() => new Error());
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, 'Error parsing JSON file');
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(err.showStack);
                assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should invoke the callback with an error when the file version is invalid', (done) => {
            const invalidVersionErrorMessagePrefix = 'Task manifest file contains an invalid version specification: ';
            const invalidVersionErrorMessage = invalidVersionErrorMessagePrefix + 'abc.' + helpers.minorVersion + '.' + helpers.patchVersion;
            callback = (err, data) => {
                assert.isUndefined(data);
                assert.deepEqual(err.message, invalidVersionErrorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                done();
            };
            semverValidStub.callsFake(() => false);
            jsonParseStub.callsFake(() => helpers.invalidSampleOneTaskContents);
            throughObjStub.yields(helpers.invalidSampleOneTaskFile, null, callback);
            plugin.bump(opts);
        });
    });

    suite('Update file errors Suite:', () => {
        const errorMessage = 'Error bumping version';

        test('Should invoke the callback with an error when the inc throws an error', (done) => {
            semverIncStub.throws(() => new Error());
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, errorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(err.showStack);
                assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts); 
        });

        test('Should invoke the callback with an error when retrieving major throws an error', (done) => {
            semverMajorStub.throws(() => new Error());
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, errorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(err.showStack);
                assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts); 
        });

        test('Should invoke the callback with an error when retrieving minor throws an error', (done) => {
            semverMinorStub.throws(() => new Error());
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, errorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(err.showStack);
                assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts); 
        });

        test('Should invoke the callback with an error when retrieving patch throws an error', (done) => {
            semverPatchStub.throws(() => new Error());
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, errorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(err.showStack);
                assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts); 
        });
    });

    suite('Update file Suite:', () => {
        const bumpedPatchVersion = helpers.patchVersion + 1;
        setup(() => {
            semverPatchStub.callsFake(() => bumpedPatchVersion);
        });

        test('Should correctly bump the file', (done) => {
            const taskJson = helpers.createSampleTaskContents(helpers.majorVersionStr, helpers.minorVersionStr, helpers.patchVersionStr);
            callback = (err, data) => {
                assert.isNull(err);
                assert.isTrue(jsonStringifySpy.calledWith(taskJson));
                assert.deepEqual(taskJson.version.Major, helpers.majorVersionStr);
                assert.deepEqual(taskJson.version.Minor, helpers.minorVersionStr);
                assert.deepEqual(taskJson.version.Patch, bumpedPatchVersion.toString());
                assert.deepEqual(data.contents, new Buffer(JSON.stringify(taskJson)));
                assert.isTrue(semverIncStub.calledWith(helpers.initialVersion, helpers.defaultReleaseType));
                done();
            };
            jsonParseStub.callsFake(() => taskJson);
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });
    });

    suite('Log output Suite:', () => {
        test('Should log output when options does not set quiet prop', (done) => {
            opts = {};
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should log output when options sets quiet prop to 0', (done) => {
            opts.quiet = 0;
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should log output when options sets quiet prop to negative value', (done) => {
            opts.quiet = -1;
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should log output when options sets quiet prop to string value', (done) => {
            opts.quiet = 'true';
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should log output when quiet is false', (done) => {
            opts.quiet = false;
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should not log output when options has quiet prop set to true', (done) => {
            opts.quiet = true;
            callback = () => {
                assert.isFalse(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should log correct output content', (done) => {
            const initialVersionMessage = 'Bumped ' + chalk.blue(helpers.initialVersion);
            const newVersionMessage = ' to ' + chalk.magenta(helpers.bumpedVersion);
            const bumpTypeMessage = ' with type: ' + chalk.blue(helpers.defaultReleaseType);
            const logMessage = initialVersionMessage + newVersionMessage + bumpTypeMessage;
            callback = () => {
                assert.isTrue(logInfoStub.calledWith(logMessage));
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump({});
        });
    });
});