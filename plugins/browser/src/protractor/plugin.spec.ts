// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { Config, PluginConfig, ProtractorBrowser, Ptor } from 'protractor';
import { TractorBrowser } from '../tractor-browser';

// Under test:
import { plugin } from './plugin';

describe('@tractor-plugins/browser - plugin:', () => {
    it('should add a new plugin', () => {
        const config = ineeda<Config>({ plugins: [] });

        plugin(config);

        expect(config.plugins!.length).to.equal(1);
    });

    it('should have an `onPrepare` step', () => {
        const config = ineeda<Config>({ plugins: [] });

        plugin(config);

        const [inlinePlugin] = config.plugins!;

        expect(inlinePlugin.inline!.onPrepare).to.not.equal(undefined);
    });

    it('should add keyboard helpers', () => {
        const browser = ineeda<ProtractorBrowser>();
        const protractor = ineeda<Ptor>({ browser });
        Object.defineProperty(global, 'protractor', {
            get (): Ptor { return protractor; }
        });

        const config = ineeda<Config>({ plugins: [] });

        plugin(config);

        const [inlinePlugin] = config.plugins as Array<PluginConfig>;
        inlinePlugin.inline!.onPrepare!();

        // HACK:
        // By this point `browser` will have has the `TractorBrowser` methods
        // added to it, so this type is valid.
        const tractorBrowser = browser as unknown as TractorBrowser;
        expect(tractorBrowser.sendDeleteKey).to.not.equal(undefined);
        expect(tractorBrowser.sendEnterKey).to.not.equal(undefined);
        expect(tractorBrowser.sendSpaceKey).to.not.equal(undefined);
        expect(tractorBrowser.focusNext).to.not.equal(undefined);
        expect(tractorBrowser.focusPrevious).to.not.equal(undefined);
    });
});
