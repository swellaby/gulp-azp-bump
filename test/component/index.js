'use strict';

const Chai = require('chai');
const File = require('vinyl');
const log = require('fancy-log');
const ReadableStream = require('stream').Readable;
const Sinon = require('sinon');

const helpers = require('../helpers');
const vstsBump = require('../..');

const assert = Chai.assert;

suite('Module Suite:', () => {
    let fakeFile = new File();
    let logInfoStub;
    let opts;
    const sandbox = Sinon.sandbox.create();

    setup(() => {
        logInfoStub = sandbox.stub(log, 'info');
        fakeFile = new File({
            contents: new Buffer(JSON.stringify(helpers.validSampleOneTaskContents)),
            path: helpers.filePath
        });
        opts = {};
    });

    teardown(() => {
        sandbox.restore();
        fakeFile = null;
        opts = null;
    });

    suite('Successful bump string version Suite:', () => {
        setup(() => {
            opts.versionPropertyType = helpers.stringVersionPropertyType;
        });

        test('Should bump patch version when nothing is specified', (done) => {
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionStringObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when invalid type is specified', (done) => {
            opts.type = 'foobar';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionStringObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump patch version when patch type is specified', (done) => {
            opts.type = helpers.patchReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionStringObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump patch version when prerelease type is specified', (done) => {
            opts.type = 'prerelease';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionStringObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump minor version when minor type is specified', (done) => {
            opts.type = helpers.minorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMinorVersionStringObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump major version when major type is specified', (done) => {
            opts.type = helpers.majorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMajorVersionStringObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });

    suite('Successful bump number version Suite:', () => {
        let opts;

        setup(() => {
            opts = {};
            opts.versionPropertyType = helpers.defaultVersionPropertyType;
        });

        teardown(() => {
            opts = null;
        });

        test('Should bump patch version when nothing is specified', (done) => {
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionNumberObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when invalid type is specified', (done) => {
            opts.type = 'foobar';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionNumberObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump patch version when patch type is specified', (done) => {
            opts.type = helpers.patchReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionNumberObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump patch version when prerelease type is specified', (done) => {
            opts.type = 'prerelease';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionNumberObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump minor version when minor type is specified', (done) => {
            opts.type = helpers.minorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMinorVersionNumberObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump major version when major type is specified', (done) => {
            opts.type = helpers.majorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMajorVersionNumberObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });

    suite('Indent configuration options Suite:', () => {
        test('Should use default indent when no indent specified', (done) => {
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, helpers.defaultJsonIndent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use default indent when invalid indent specified', (done) => {
            opts.indent = 'invalid';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, helpers.defaultJsonIndent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use default indent when NaN indent specified', (done) => {
            opts.indent = NaN;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, helpers.defaultJsonIndent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use default indent when negative indent specified', (done) => {
            opts.indent = -7;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, helpers.defaultJsonIndent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use default indent when zero indent specified', (done) => {
            opts.indent = 0;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, helpers.defaultJsonIndent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use default indent when indent over ten specified', (done) => {
            opts.indent = 32;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, helpers.defaultJsonIndent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use specified indent when indent of one specified', (done) => {
            const indent = 1;
            opts.indent = indent;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, indent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use specified indent when indent of ten specified', (done) => {
            const indent = 10;
            opts.indent = indent;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, indent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use specified indent when indent between one and ten specified', (done) => {
            const indent = 6;
            opts.indent = indent;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, indent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should use specified indent when tab indent specified', (done) => {
            const indent = '\t';
            opts.indent = indent;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const expected = JSON.stringify(helpers.validSampleOneNumericBumpedVersionTaskContents, null, indent);
                assert.deepEqual(newFile.contents.toString(), expected);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });

    suite('Failed bump Suite:', () => {
        test('Should return the file when it is null', (done) => {
            fakeFile.contents = null;
            const bump = vstsBump();
            bump.once(helpers.streamDataEventName, function(file) {
                assert.deepEqual(file, fakeFile);
                done();
            });
            bump.write(fakeFile);
            bump.end();
        });

        test('Should bubble an error when the file content is a stream', (done) => {
            fakeFile.contents = new ReadableStream();
            const bump = vstsBump();
            bump.once('error', function(e) {
                assert.isNotNull(e);
                assert.deepEqual(e.message, 'Streaming not supported');
                done();
            });
            bump.write(fakeFile);
            bump.end();
        });

        test('Should bubble an error when a fatal exception occurs while updating the file', (done) => {
            logInfoStub.throws(() => new Error());
            const bump = vstsBump();
            bump.once('error', function(e) {
                assert.isNotNull(e);
                assert.deepEqual(e.message, 'Error bumping version');
                done();
            });
            bump.write(fakeFile);
            bump.end();
        });
    });

    suite('Log output Suite:', () => {
        test('Should not log output when no quiet option is specified', (done) => {
            const bump = vstsBump({ quiet: true });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isFalse(logInfoStub.called);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should not log output when quiet option is set to true', (done) => {
            const bump = vstsBump({ quiet: true });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isFalse(logInfoStub.called);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should log output when quiet option is set to false', (done) => {
            const bump = vstsBump({ quiet: false });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isTrue(logInfoStub.calledWith(helpers.expectedLogMessage));
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });
});