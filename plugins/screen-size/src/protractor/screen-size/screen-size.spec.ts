// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { ProtractorBrowser } from 'protractor';
import { ISize, Options, Window } from 'selenium-webdriver';
import { ExtendedWebDriver } from 'webdriver-js-extender';
import { TractorScreenSizeConfigInternal } from './screen-size-config';

// Under test:
import { ScreenSize } from './screen-size';

describe('@tractor-plugins/screen-size - ScreenSize:', () => {
    describe('ScreenSize.setSize', () => {
        it('should set the size of the browser window', async () => {
            const window = ineeda<Window>({
                getSize: (): Promise<ISize> => Promise.resolve({ width: 320, height: 480 }),
                setSize: (): Promise<void> => Promise.resolve()
            });
            const browser = ineeda<ProtractorBrowser>({
                driver: ineeda<ExtendedWebDriver>({
                    manage: (): Options => ineeda<Options>({
                        window: (): Window => window
                    })
                })
            });
            const config = {
                screenSizes: {
                    sm: { width: 320, height: 480 }
                }
            };
            const screenSize = new ScreenSize(browser, config);

            await screenSize.setSize('sm');

            const expectedWidth = 320;
            const expectedHeight = 480;
            expect(window.setSize).to.have.been.calledWith(expectedWidth, expectedHeight);
        });

        it(`should throw an error if dimensions aren't given for a size`, async () => {
            const browser = ineeda<ProtractorBrowser>();
            const config = ineeda<TractorScreenSizeConfigInternal>({});
            const screenSize = new ScreenSize(browser, config);

            try {
                await screenSize.setSize('sm');
            } catch (error) {
                expect(error).to.deep.equal(new TractorError('Cannot find a screen size configuration for "sm".'));
            }
        });
    });
});
