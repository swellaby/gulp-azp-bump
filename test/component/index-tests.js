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
    const sandbox = Sinon.sandbox.create();

    setup(() => {
        logInfoStub = sandbox.stub(log, 'info');
        fakeFile = new File({
            contents: new Buffer(JSON.stringify(helpers.validSampleOneTaskContents)),
            path: helpers.filePath
        });
    });

    teardown(() => {
        sandbox.restore();
        fakeFile = null;
    });

    suite('Successful bump Suite:', () => {
        test('Should bump patch version when nothing is specified', (done) => {
            const bump = vstsBump();
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when invalid type is specified', (done) => {
            const bump = vstsBump({ type: 'foobar' });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump patch version when patch type is specified', (done) => {
            const bump = vstsBump({ type: helpers.patchReleaseType });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump patch version when prerelease type is specified', (done) => {
            const bump = vstsBump({ type: helpers.patchReleaseType });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump minor version when minor type is specified', (done) => {
            const bump = vstsBump({ type: helpers.minorReleaseType });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMinorVersionObject);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should correctly bump major version when major type is specified', (done) => {
            const bump = vstsBump({ type: helpers.majorReleaseType });
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMajorVersionObject);
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