'use strict';

const Chai = require('chai');
const File = require('vinyl');
const fs = require('fs');
const log = require('fancy-log');
const path = require('path');
const Sinon = require('sinon');

const helpers = require('../helpers');
const vstsBump = require('../..');

const assert = Chai.assert;

suite('Files Suite:', () => {
    const initialStringFilePath = path.resolve(__dirname, 'files/string/task.json');
    const initialStringFile = fs.readFileSync(initialStringFilePath);
    let fakeFile = new File();
    const patchStringFilePath = path.resolve(__dirname, 'files/string/patch.json');
    const patchStringFile = JSON.parse(fs.readFileSync(patchStringFilePath, 'utf8'));

    setup(() => {
        Sinon.stub(log, 'info');
        fakeFile = new File({
            contents: initialStringFile,
            path: initialStringFilePath,
            base: 'test/',
            cwd: 'test/'
        });
    });

    teardown(() => {
        Sinon.restore();
        fakeFile = null;
    });

    suite('Successful string bump Suite:', () => {
        let opts;

        setup(() => {
            opts = {};
            opts.versionPropertyType = helpers.stringVersionPropertyType;
        });

        teardown(() => {
            opts = null;
        });

        test('Should bump patch version when nothing is specified', (done) => {
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchStringFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when invalid type is specified', (done) => {
            opts.type = 'invalid';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchStringFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when patch type is specified', (done) => {
            opts.type = helpers.patchReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchStringFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump minor version when minor type is specified', (done) => {
            opts.type = helpers.minorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                const minorFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/string/minor.json')));
                assert.deepEqual(JSON.parse(newFile.contents), minorFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump major version when major type is specified', (done) => {
            opts.type = helpers.majorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                const majorFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/string/major.json')));
                assert.deepEqual(JSON.parse(newFile.contents), majorFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });

    suite('Successful number bump Suite:', () => {
        let opts;
        const patchNumberFilePath = path.resolve(__dirname, 'files/number/patch.json');
        const patchNumberFile = JSON.parse(fs.readFileSync(patchNumberFilePath, 'utf8'));

        setup(() => {
            opts = {};
            opts.versionPropertyType = helpers.defaultVersionPropertyType;
            // fakeFile = new File({
            //     contents: initialStringFile,
            //     path: initialStringFilePath,
            //     base: 'test/',
            //     cwd: 'test/'
            // });
        });

        teardown(() => {
            opts = null;
        });

        test('Should bump patch version when nothing is specified', (done) => {
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchNumberFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when invalid type is specified', (done) => {
            opts.type = 'invalid';
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchNumberFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump patch version when patch type is specified', (done) => {
            opts.type = helpers.patchReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchNumberFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump minor version when minor type is specified', (done) => {
            opts.type = helpers.minorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                const minorFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/number/minor.json')));
                assert.deepEqual(JSON.parse(newFile.contents), minorFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bump major version when major type is specified', (done) => {
            opts.type = helpers.majorReleaseType;
            const bump = vstsBump(opts);
            bump.once(helpers.streamDataEventName, function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                const majorFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/number/major.json')));
                assert.deepEqual(JSON.parse(newFile.contents), majorFile);
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });

    suite('Invalid content Suite:', () => {
        const invalidValuesFilePath = path.resolve(__dirname, 'files/invalid-values.json');
        const invalidValuesFile = fs.readFileSync(invalidValuesFilePath);

        setup(() => {
            fakeFile = new File({
                contents: invalidValuesFile,
                path: invalidValuesFilePath,
                base: 'test/',
                cwd: 'test/'
            });
        });

        test('Should bubble an error when the version values are invalid', (done) => {
            const bump = vstsBump();
            bump.once(helpers.streamErrorEventName, function(e) {
                assert.isNotNull(e);
                assert.deepEqual(e.message, 'Task manifest file contains an invalid version specification: foo.1.1');
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bubble an error when the version object key is invalid', (done) => {
            const invalidMajorKeyFilePath = path.resolve(__dirname, 'files/invalid-major-key.json');
            const invalidMajorKeyFile = fs.readFileSync(invalidMajorKeyFilePath);
            fakeFile.contents = invalidMajorKeyFile;
            fakeFile.path = invalidMajorKeyFilePath;
            const bump = vstsBump();
            bump.once(helpers.streamErrorEventName, function(e) {
                assert.isNotNull(e);
                assert.deepEqual(e.message, 'Task manifest file contains an invalid version specification: undefined.1.1');
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });

        test('Should bubble an error when the version object key is invalid', (done) => {
            const invalidVersionKeyFilePath = path.resolve(__dirname, 'files/invalid-version-key.json');
            const invalidVersionKeyFile = fs.readFileSync(invalidVersionKeyFilePath);
            fakeFile.contents = invalidVersionKeyFile;
            fakeFile.path = invalidVersionKeyFilePath;
            const bump = vstsBump();
            bump.once(helpers.streamErrorEventName, function(e) {
                assert.isNotNull(e);
                assert.deepEqual(e.message, 'Error parsing JSON file');
                done();
            });

            bump.write(fakeFile);
            bump.end();
        });
    });
});