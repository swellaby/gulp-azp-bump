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
});