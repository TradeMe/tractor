// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { TractorConfig } from '@tractor/config-loader';
import { inject } from '@tractor/dependency-injection';

// Under test:
import { tractor, Tractor } from './index';

import { version } from '../package.json';

describe('@tractor/tractor - tractor:', () => {
    it('should create a new Tractor object with the right version', () => {
        const t = tractor('../fixtures/test.tractor.conf.js');

        expect(t).to.be.an.instanceof(Tractor);
        expect(t.version).to.equal(version);
    });

    describe('@tractor/tractor - Tractor#call', () => {
        it('should provide a hook into DI', () => {
            const t = tractor('../fixtures/test.tractor.conf.js');

            const c = inject((config: TractorConfig): TractorConfig =>  config, 'config');

            const config = t.call(c);
            expect(config).to.equal(t.config);
        });
    });

    describe('@tractor/tractor - Tractor#constant', () => {
        it('should provide a way to declare a constant in DI', () => {
            const t = tractor('../fixtures/test.tractor.conf.js');
            
            t.constant({ c: 'c' });
            
            const c = inject((c: string): string => c, 'c');

            expect(t.call(c)).to.equal('c');
        });
    });

    describe('@tractor/tractor - Tractor#plugin', () => {
        it('should set up the debug param', () => {
            const t = tractor('../fixtures/test.tractor.conf.js');

            const config = t.plugin({});

            expect(config.params.debug).to.equal(false);
        });

        // TODO:
        // This test is not super good, and it could be better:
        it('should run the `plugin` hook for each plugin', () => {
            const t = tractor('../fixtures/test.tractor.conf.js');

            let called = 0;
            const [browser, screenSize] = t.plugins;
            browser.plugin = (config) => {
                called += 1;
                return config;
            };
            screenSize.plugin = (config) => {
                called += 1;
                return config;
            };

            t.plugin({});

            expect(called).to.equal(2);
        });
    });
});
