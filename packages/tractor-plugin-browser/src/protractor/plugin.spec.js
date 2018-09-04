// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Under test:
import { plugin } from './plugin';

describe('@tractor-plugins/browser - plugin:', () => {
    it('should add a new plugin', () => {
        const config = {};

        plugin(config);

        expect(config.plugins.length).to.equal(1);
    });

    it('should have an `onPrepare` step', () => {
        const config = {};

        plugin(config);

        const [inlinePlugin] = config.plugins;

        expect(inlinePlugin.inline.onPrepare).to.not.be.undefined();
    });

    it('should add keyboard helpers', () => {
        const config = {};
        const browser = ineeda();
        const Keys = ineeda();
        global.protractor = { browser, Keys };

        plugin(config);

        const [inlinePlugin] = config.plugins;
        inlinePlugin.inline.onPrepare();

        expect(browser.sendDeleteKey).to.not.be.undefined();
        expect(browser.sendEnterKey).to.not.be.undefined();
    });
});
