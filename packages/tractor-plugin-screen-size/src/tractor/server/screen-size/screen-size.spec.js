// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';

// Under test:
import { ScreenSize } from './screen-size';

describe('@tractor-plugins/screen-size - ScreenSize:', () => {
    describe('ScreenSize.setSize', () => {
        it('should set the size of the browser window', async () => {
            const window = ineeda({
                setSize: () => Promise.resolve(),
                getSize: () => Promise.resolve({ width: 320, height: 480 })
            });
            const browser = {
                driver: {
                    manage: () => ({
                        window: () => window
                    })
                }
            };
            const config = {
                screenSizes: {
                    sm: { width: 320, height: 480 }
                }
            };
            const screenSize = new ScreenSize(browser, config);

            await screenSize.setSize('sm');
            expect(window.setSize).to.have.been.calledWith(320, 480);
        });

        it('should fall back to the default height', async () => {
            const window = ineeda({
                setSize: () => Promise.resolve(),
                getSize: () => Promise.resolve({ width: 480, height: 1000 })
            });
            const browser = {
                driver: {
                    manage: () => ({
                        window: () => window
                    })
                }
            };
            const config = {
                screenSizes: {
                    sm: { width: 480 }
                }
            };
            const screenSize = new ScreenSize(browser, config);

            await screenSize.setSize('sm');
            expect(window.setSize).to.have.been.calledWith(480, 1000);
        });

        it('should set just the width if only one number is given', async () => {
            const window = ineeda({
                setSize: () => Promise.resolve(),
                getSize: () => Promise.resolve({ width: 480, height: 1000 })
            });
            const browser = {
                driver: {
                    manage: () => ({
                        window: () => window
                    })
                }
            };
            const config = {
                screenSizes: {
                    sm: 480
                }
            };
            const screenSize = new ScreenSize(browser, config);

            await screenSize.setSize('sm');
            expect(window.setSize).to.have.been.calledWith(480, 1000);
        });

        it(`should throw an error if dimensions aren't given for a size`, async () => {
            const browser = ineeda();
            const config = ineeda();
            const screenSize = new ScreenSize(browser, config);

            try {
                await screenSize.setSize('sm');
            } catch (error) {
                expect(error).to.deep.equal(new TractorError('Cannot find a screen size configuration for "sm"'));
            }
        });
    });
});
