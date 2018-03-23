'use strict';

const Chai = require('chai');
const File = require('vinyl');
const fs = require('fs');
const log = require('fancy-log');
const path = require('path');
const Sinon = require('sinon');

const helpers = require('../helpers');
const index = require('../../lib/index');

const assert = Chai.assert;

suite('Files Suite:', () => {
    const initialFilePath = path.resolve(__dirname, 'files/task.json');
    const initialFile = fs.readFileSync(initialFilePath);
    let fakeFile = new File();
    const sandbox = Sinon.sandbox.create();
    const patchFilePath = path.resolve(__dirname, 'files/patch.json');
    const patchFile = JSON.parse(fs.readFileSync(patchFilePath, 'utf8'));

    setup(() => {
        sandbox.stub(log, 'info');
        fakeFile = new File({
            contents: initialFile,
            path: initialFilePath,
            base: 'test/',
            cwd: 'test/'
        });
    });

    teardown(() => {
        sandbox.restore();
        fakeFile = null;
    });

    suite('Successful bump Suite:', () => {
        test('Should bump patch version when nothing is specified', (done) => {
            const bump = index();
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchFile);
                done();
            });
          
            bump.write(fakeFile);
            bump.end();
        });
    
        test('Should bump patch version when invalid type is specified', (done) => {
            const bump = index({ type: 'invalid' });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchFile);
                done();
            });
          
            bump.write(fakeFile);
            bump.end();
        });
    
        test('Should bump patch version when patch type is specified', (done) => {
            const bump = index({ type: helpers.patchReleaseType });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                assert.deepEqual(JSON.parse(newFile.contents), patchFile);
                done();
            });
          
            bump.write(fakeFile);
            bump.end();
        });
    
        test('Should bump minor version when minor type is specified', (done) => {
            const bump = index({ type: helpers.minorReleaseType });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                const minorFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/minor.json')));
                assert.deepEqual(JSON.parse(newFile.contents), minorFile);
                done();
            });
          
            bump.write(fakeFile);
            bump.end();
        });
    
        test('Should bump major version when major type is specified', (done) => {
            const bump = index({ type: helpers.majorReleaseType });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isNotNull(newFile.path);
                const majorFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/major.json')));
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
            const bump = index();
            bump.once('error', function(e) {
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
            const bump = index();
            bump.once('error', function(e) {
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
            const bump = index();
            bump.once('error', function(e) {
                assert.isNotNull(e);
                assert.deepEqual(e.message, 'Error parsing JSON file');
                done();
            });
          
            bump.write(fakeFile);
            bump.end();
        });
    });
});