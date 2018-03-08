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
    const fileStub = {
        isNull: () => false,
        isStream: () => false,
    };
    let semverIncStub;
    let throughObjStub;
    let fileIsNullStub;
    let fileIsStreamStub;   
    const patchType = 'patch';
    const minor = 'minor';
    const major = 'major';
    const defaultReleaseType = patchType;    
        
    setup(() => {
        opts = {};
        semverIncStub = sandbox.stub(semver, 'inc').callsFake(() => { return true; });
        throughObjStub = sandbox.stub(through, 'obj');
        fileIsNullStub = sandbox.stub(fileStub, 'isNull').callsFake(() => false);
        fileIsStreamStub = sandbox.stub(fileStub, 'isStream').callsFake(() => false);
    });

    teardown(() => {
        sandbox.restore();
        opts = null;
    });

    suite('Default Options Suite', () => {               
        const throughStub = {};
        
        setup(() => {            
            throughObjStub.callsFake(() => throughStub);        
        });

        test('Should set release type to default if no type is specified', () => {
            plugin.bump(opts);
            assert.deepEqual(opts.type, defaultReleaseType);
        });

        test('Should set release type to default if invalid type is specified', () => {
            opts.type = 'bad';
            semverIncStub.callsFake(() => false);
            plugin.bump(opts);
            assert.deepEqual(opts.type, defaultReleaseType);
        });

        test('Should use specified release type when patch type is specified', () => {            
            opts.type = patchType;
            plugin.bump(opts);
            assert.deepEqual(opts.type, patchType);
        });

        test('Should use specified release type when minor type is specified', () => {           
            opts.type = minor;
            plugin.bump(opts);
            assert.deepEqual(opts.type, minor);
        });

        test('Should use specified release type when major type is specified', () => {
            opts.type = major;
            plugin.bump(opts);
            assert.deepEqual(opts.type, major);
        });

        test('Should return a stream', () => {
            const stream = plugin.bump();
            assert.isTrue(throughObjStub.called);
            assert.deepEqual(stream, throughStub);
        });
    });

    suite('File validation Suite', () => {
        let callback;

        setup(() => {
            throughObjStub.yields(fileStub, null, callback);
        });

        teardown(() => {
            callback = null;
        });

        test('Should invoke the callback with the file when the file is null', (done) => {            
            callback = (err, data) => {
                console.log('up in hurrrr');
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
    });
});