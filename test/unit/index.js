'use strict';

const Chai = require('chai');
const log = require('fancy-log');
const semver = require('semver');
const Sinon = require('sinon');
const through = require('through2');

const helpers = require('../helpers');
const index = require('../../lib/index');
const utils = require('../../lib/utils');
const assert = Chai.assert;

suite('index Suite:', () => {
    let opts;
    let fileStub;
    let callback;
    let semverValidStub;
    let throughObjStub;
    let fileIsNullStub;
    let fileIsStreamStub;
    let jsonParseStub;
    let jsonStringifySpy;
    let logInfoStub;
    let utilsValidateOptionsStub;
    let utilsGetTaskVersionStub;
    let utilsBumpVersionStub;

    const stubUtilsFunctions = () => {
        utilsValidateOptionsStub = Sinon.stub(utils, 'validateOptions').callsFake(() => helpers.defaultOptions);
        utilsGetTaskVersionStub = Sinon.stub(utils, 'getTaskVersion').callsFake(() => helpers.initialVersion);
        utilsBumpVersionStub = Sinon.stub(utils, 'bumpVersion').callsFake(() => helpers.bumpedVersion);
    };

    setup(() => {
        opts = { quiet: true };
        stubUtilsFunctions();
        fileStub = helpers.validSampleOneTaskFile;
        semverValidStub = Sinon.stub(semver, 'valid').callsFake(() => { return true; });
        throughObjStub = Sinon.stub(through, 'obj');
        fileIsNullStub = Sinon.stub(fileStub, 'isNull').callsFake(() => false);
        fileIsStreamStub = Sinon.stub(fileStub, 'isStream').callsFake(() => false);
        jsonParseStub = Sinon.stub(JSON, 'parse').callsFake(() => { return helpers.validSampleOneTaskContents; });
        jsonStringifySpy = Sinon.spy(JSON, 'stringify');
        logInfoStub = Sinon.stub(log, 'info');
    });

    teardown(() => {
        Sinon.restore();
        opts = null;
        fileStub = null;
    });

    suite('bump Suite:', () => {
        test('Should validate options with utils function', () => {
            index(opts);
            assert.isTrue(utilsValidateOptionsStub.calledWith(opts));
        });

        test('Should return a stream', () => {
            const throughStub = {};
            throughObjStub.callsFake(() => throughStub);
            const stream = index();
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
            index(opts);
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
            index(opts);
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
            index(opts);
        });

        test('Should invoke the callback with an error when the file version is invalid', (done) => {
            const invalidVersion = 'abc.' + helpers.minorVersion + '.' + helpers.patchVersion;
            const invalidVersionErrorMessagePrefix = 'Task manifest file contains an invalid version specification: ';
            const invalidVersionErrorMessage = invalidVersionErrorMessagePrefix + invalidVersion;
            semverValidStub.callsFake(() => false);
            jsonParseStub.callsFake(() => helpers.invalidSampleOneTaskContents);
            utilsGetTaskVersionStub.callsFake(() => invalidVersion);
            callback = (err, data) => {
                assert.isUndefined(data);
                assert.deepEqual(err.message, invalidVersionErrorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                done();
            };
            throughObjStub.yields(helpers.invalidSampleOneTaskFile, null, callback);
            index(opts);
        });
    });

    suite('Update file errors Suite:', () => {
        const errorMessage = 'Error bumping version';

        test('Should invoke the callback with an error when bumping version throws an error', (done) => {
            utilsBumpVersionStub.throws(() => new Error());
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
            index(opts);
        });

        test('Should invoke the callback with an error when logger throws an error', (done) => {
            logInfoStub.throws(() => new Error());
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
            index(opts);
        });
    });

    suite('Update file Suite:', () => {
        const bumpedPatchVersion = (helpers.patch + 1);

        test('Should correctly bump the file with string property type', (done) => {
            opts.versionPropertyType = helpers.stringVersionPropertyType;
            const taskJson = helpers.createSampleTaskContents(helpers.majorVersionStr, helpers.minorVersionStr, helpers.patchVersionStr);
            utilsBumpVersionStub.callsFake(() => {
                taskJson.version.Patch = bumpedPatchVersion.toString();
                return helpers.bumpedVersion;
            });

            callback = (err, data) => {
                assert.isNull(err);
                assert.isTrue(jsonStringifySpy.calledWith(taskJson));
                assert.deepEqual(taskJson.version.Major, helpers.majorVersionStr);
                assert.deepEqual(taskJson.version.Minor, helpers.minorVersionStr);
                assert.deepEqual(taskJson.version.Patch, bumpedPatchVersion.toString());
                assert.deepEqual(data.contents, new Buffer(JSON.stringify(taskJson, null, helpers.defaultJsonIndent)));
                assert.isTrue(utilsBumpVersionStub.calledWith(taskJson, helpers.initialVersion, helpers.defaultOptions));
                done();
            };
            jsonParseStub.callsFake(() => taskJson);
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
        });

        test('Should correctly bump the file with number property type', (done) => {
            const taskJson = helpers.createSampleTaskContents(helpers.majorVersion, helpers.minorVersion, helpers.patchVersion);
            utilsBumpVersionStub.callsFake(() => {
                taskJson.version.Patch = bumpedPatchVersion;
                return helpers.bumpedVersion;
            });

            callback = (err, data) => {
                assert.isNull(err);
                assert.isTrue(jsonStringifySpy.calledWith(taskJson));
                assert.deepEqual(taskJson.version.Major, helpers.majorVersion);
                assert.deepEqual(taskJson.version.Minor, helpers.minorVersion);
                assert.deepEqual(taskJson.version.Patch, bumpedPatchVersion);
                assert.deepEqual(data.contents, new Buffer(JSON.stringify(taskJson, null, helpers.defaultJsonIndent)));
                assert.isTrue(utilsBumpVersionStub.calledWith(taskJson, helpers.initialVersion, helpers.defaultOptions));
                done();
            };
            jsonParseStub.callsFake(() => taskJson);
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
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
            index(opts);
        });

        test('Should log output when options sets quiet prop to 0', (done) => {
            opts.quiet = 0;
            utilsValidateOptionsStub.callsFake(() => {
                return {
                    type: helpers.defaultReleaseType,
                    indent: helpers.defaultJsonIndent,
                    versionPropertyType: helpers.defaultVersionPropertyType,
                    quiet: -1
                };
            });
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
        });

        test('Should log output when options sets quiet prop to negative value', (done) => {
            opts.quiet = -1;
            utilsValidateOptionsStub.callsFake(() => {
                return {
                    type: helpers.defaultReleaseType,
                    indent: helpers.defaultJsonIndent,
                    versionPropertyType: helpers.defaultVersionPropertyType,
                    quiet: -1
                };
            });
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
        });

        test('Should log output when options sets quiet prop to string value', (done) => {
            opts.quiet = 'true';
            utilsValidateOptionsStub.callsFake(() => {
                return {
                    type: helpers.defaultReleaseType,
                    indent: helpers.defaultJsonIndent,
                    versionPropertyType: helpers.defaultVersionPropertyType,
                    quiet: 'true'
                };
            });
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
        });

        test('Should log output when quiet is false', (done) => {
            opts.quiet = false;
            utilsValidateOptionsStub.callsFake(() => {
                return {
                    type: helpers.defaultReleaseType,
                    indent: helpers.defaultJsonIndent,
                    versionPropertyType: helpers.defaultVersionPropertyType,
                    quiet: false
                };
            });
            callback = () => {
                assert.isTrue(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
        });

        test('Should not log output when options has quiet prop set to true', (done) => {
            opts.quiet = true;
            utilsValidateOptionsStub.callsFake(() => {
                return {
                    type: helpers.defaultReleaseType,
                    indent: helpers.defaultJsonIndent,
                    versionPropertyType: helpers.defaultVersionPropertyType,
                    quiet: true
                };
            });
            callback = () => {
                assert.isFalse(logInfoStub.called);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            index(opts);
        });

        test('Should log correct output content', (done) => {
            callback = () => {
                assert.isTrue(logInfoStub.calledWith(helpers.expectedLogMessage));
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            index({});
        });
    });
});