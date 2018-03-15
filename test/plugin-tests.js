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
    const fileStub = helpers.validSampleOneTaskFile;
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
        
    setup(() => {
        opts = {};
        semverIncStub = sandbox.stub(semver, 'inc').callsFake(() => { return true; });
        semverValidStub = sandbox.stub(semver, 'valid').callsFake(() => { return true; });
        semverMajorStub = sandbox.stub(semver, 'major').callsFake(() => { return true; });
        semverMinorStub = sandbox.stub(semver, 'minor').callsFake(() => { return true; });
        semverPatchStub = sandbox.stub(semver, 'patch').callsFake(() => { return true; });
        throughObjStub = sandbox.stub(through, 'obj');
        fileIsNullStub = sandbox.stub(fileStub, 'isNull').callsFake(() => false);
        fileIsStreamStub = sandbox.stub(fileStub, 'isStream').callsFake(() => false);
        jsonParseStub = sandbox.stub(JSON, 'parse').callsFake(() => { return helpers.validSampleOneTaskContents; });
    });

    teardown(() => {
        sandbox.restore();
        opts = null;
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

    suite('parseFile Suite:', () => {
        const parsingErrorMessage = 'Error parsing JSON file';
        const invalidVersionErrorMessagePrefix = 'Task manifest file contains an invalid version specification: ';
        const invalidVersionErrorMessage = invalidVersionErrorMessagePrefix + 'foo';

        test('Should invoke the callback with an error when the file parse fails', (done) => {
            jsonParseStub.throws(() => new Error());
            callback = (err, data) => {
                assert.isNotNull(err);
                assert.isUndefined(data);
                assert.deepEqual(err.message, parsingErrorMessage);
                assert.deepEqual(err.plugin, helpers.pluginName);
                assert.isTrue(err.showStack);
                assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });

        test('Should invoke the callback with an error when the file version is invalid', (done) => {
            callback = (err, data) => {
                // assert.isNotNull(err);
                // assert.isUndefined(data);
                // assert.deepEqual(err.message, parsingErrorMessage);
                // assert.deepEqual(err.plugin, helpers.pluginName);
                // assert.isTrue(err.showStack);
                // assert.deepEqual(err.fileName, helpers.filePath);
                done();
            };
            throughObjStub.yields(fileStub, null, callback);
            plugin.bump(opts);
        });
    });
});