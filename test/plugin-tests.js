'use strict';

const Chai = require('chai');
const semver = require('semver');
const Sinon = require('sinon');
const through = require('through2');

const helpers = require('./helpers');
const plugin = require('../lib/plugin');
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

    const stubSemverFunctions = () => {
        semverIncStub = sandbox.stub(semver, 'inc').callsFake(() => helpers.bumpedVersion);
        semverValidStub = sandbox.stub(semver, 'valid').callsFake(() => { return true; });
        semverMajorStub = sandbox.stub(semver, 'major').callsFake(() => helpers.majorVersion);
        semverMinorStub = sandbox.stub(semver, 'minor').callsFake(() => helpers.minorVersion);
        semverPatchStub = sandbox.stub(semver, 'patch').callsFake(() => helpers.patchVersion);
    };

    setup(() => {
        opts = {};
        fileStub = helpers.validSampleOneTaskFile;
        stubSemverFunctions();
        throughObjStub = sandbox.stub(through, 'obj');
        fileIsNullStub = sandbox.stub(fileStub, 'isNull').callsFake(() => false);
        fileIsStreamStub = sandbox.stub(fileStub, 'isStream').callsFake(() => false);
        jsonParseStub = sandbox.stub(JSON, 'parse').callsFake(() => { return helpers.validSampleOneTaskContents; });
        jsonStringifySpy = sandbox.spy(JSON, 'stringify');
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

    suite('Update File Suite:', () => {
        const bumpedPatchVersion = helpers.patchVersion + 1;
        setup(() => {
            semverPatchStub.callsFake(() => bumpedPatchVersion);
        });

        test('Should correctly bump the file', (done) => {
            const taskJson = helpers.validSampleOneTaskContents;
            callback = (err, data) => {
                assert.isNull(err);
                assert.isTrue(jsonStringifySpy.calledWith(taskJson));
                // assert.deepEqual(taskJson.version.Major, helpers.majorVersion);
                // assert.deepEqual(taskJson.version.Minor, helpers.minorVersion);
                // assert.deepEqual(taskJson.version.Patch, bumpedPatchVersion);
                assert.deepEqual(data.contents, new Buffer(JSON.stringify(taskJson)));
                assert.isTrue(semverIncStub.calledWith(helpers.initialVersion, helpers.defaultReleaseType));
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

    });
});