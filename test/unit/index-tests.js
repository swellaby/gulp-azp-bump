'use strict';

const Chai = require('chai');
const Sinon = require('sinon');

const index = require('../../lib/index');
const plugin = require('../../lib/plugin');

const assert = Chai.assert;

suite('index Suite:', () => {
    const sandbox = Sinon.sandbox.create();
    let pluginBumpStub;
    const opts = {};
    const transform = {};

    setup(() => {
        pluginBumpStub = sandbox.stub(plugin, 'bump').callsFake(() => transform);
    });

    teardown(() => {
        sandbox.restore();
    });

    test('Should call plugin bump function', () => {
        index(opts);
        assert.isTrue(pluginBumpStub.calledWith(opts));
    });

    test('Should return Transform', () => {
        const result = index(opts);
        assert.deepEqual(result, transform);
    });
});