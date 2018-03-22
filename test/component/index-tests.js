'use strict';

const Chai = require('chai');
const File = require('vinyl');
const log = require('fancy-log');
const Sinon = require('sinon');

const helpers = require('../helpers');
const index = require('../../lib/index');

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

    suite('Bump validation Suite:', () => {
        test('Should bump patch version when nothing is specified', (done) => {
            const bump = index();
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);    
                done();
            });
          
            bump.write(fakeFile);      
            bump.end();
        });
    
        test('Should bump patch version when invalid type is specified', (done) => {
            const bump = index({ type: 'foobar' });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);    
                done();
            });
          
            bump.write(fakeFile);      
            bump.end();
        });
    
        test('Should correctly bump patch version when patch type is specified', (done) => {
            const bump = index({ type: helpers.patchReleaseType });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedPatchVersionObject);   
                done();
            });
          
            bump.write(fakeFile);      
            bump.end();
        });
    
        test('Should correctly bump minor version when minor type is specified', (done) => {
            const bump = index({ type: helpers.minorReleaseType });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMinorVersionObject);   
                done();
            });
          
            bump.write(fakeFile);      
            bump.end();
        });
    
        test('Should correctly bump major version when major type is specified', (done) => {
            const bump = index({ type: helpers.majorReleaseType });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                const updatedTask = JSON.parse(newFile.contents.toString());
                assert.deepEqual(updatedTask.version, helpers.bumpedMajorVersionObject);   
                done();
            });
          
            bump.write(fakeFile);      
            bump.end();
        });
    });

    suite('Log output Suite:', () => {
        test('Should not log output when no quiet option is specified', (done) => {
            const bump = index({ quiet: true });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isFalse(logInfoStub.called);
                done();
            });
            
            bump.write(fakeFile);      
            bump.end();
        });

        test('Should not log output when quiet option is set to true', (done) => {
            const bump = index({ quiet: true });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isFalse(logInfoStub.called);
                done();
            });
            
            bump.write(fakeFile);      
            bump.end();
        });

        test('Should log output when quiet option is set to false', (done) => {
            const bump = index({ quiet: false });
            bump.once('data', function(newFile) {
                assert.isNotNull(newFile);
                assert.isTrue(logInfoStub.calledWith(helpers.expectedLogMessage));
                done();
            });
            
            bump.write(fakeFile);      
            bump.end();
        });
    });  
});