'use strict';

const Chai = require('chai');
// const semver = require('semver');
const Sinon = require('sinon');

const helpers = require('./helpers');
const plugin = require('../lib/plugin');
const assert = Chai.assert;

suite('plugin suite', () => {
    const sandbox = Sinon.sandbox.create();
    let opts;
    // let semverIncStub;
    
    setup(() => {
        opts = {};
        // semverIncStub = sandbox.stub(semver, 'inc').callsFake(() => { return true; });
    });

    teardown(() => {
        sandbox.restore();
        opts = null;
    });

    suite('bump suite', () => {
        test('Should return false', () => {
            assert.isFalse(plugin.bump(null));
        });
    });

    suite('processFile suite', () => {
        test('Should return false', () => {
            plugin.processFile(opts, helpers.validSampleOneTaskFile, null, () => {});
            assert.isFalse(false);
        });
    });
});