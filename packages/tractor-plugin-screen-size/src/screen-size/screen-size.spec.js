/* global describe:true, it:true */

// Utilities:
import Promise from 'bluebird';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import { TractorError } from 'tractor-error-handler';

// Under test:
import { ScreenSize } from './screen-size';

describe('tractor-plugin-screen-size - ScreenSize:', () => {
    describe('ScreenSize.setSize', () => {
        it('should set the size of the browser window', () => {
            let window = {
                setSize: () => {}
            };
            let browser = {
                driver: {
                    manage: () => ({
                        window: () => window
                    })
                }
            };
            let config = {
                screenSizes: {
                    sm: { width: 320, height: 480 }
                }
            };
            let screenSize = new ScreenSize(browser, config);

            sinon.stub(window, 'setSize').returns(Promise.resolve());

            return screenSize.setSize('sm')
            .then(() => {
                expect(window.setSize).to.have.been.calledWith(320, 480);
            });
        });

        it('should fall back to the default height', () => {
            let window = {
                setSize: () => {}
            };
            let browser = {
                driver: {
                    manage: () => ({
                        window: () => window
                    })
                }
            };
            let config = {
                screenSizes: {
                    sm: { width: 320 }
                }
            };
            let screenSize = new ScreenSize(browser, config);

            sinon.stub(window, 'setSize').returns(Promise.resolve());

            return screenSize.setSize('sm')
            .then(() => {
                expect(window.setSize).to.have.been.calledWith(320, 1000);
            });
        });

        it('should set just the width if only one number is given', () => {
            let window = {
                setSize: () => {}
            };
            let browser = {
                driver: {
                    manage: () => ({
                        window: () => window
                    })
                }
            };
            let config = {
                screenSizes: {
                    sm: 320
                }
            };
            let screenSize = new ScreenSize(browser, config);

            sinon.stub(window, 'setSize').returns(Promise.resolve());

            return screenSize.setSize('sm')
            .then(() => {
                expect(window.setSize).to.have.been.calledWith(320, 1000);
            });
        });

        it(`should throw an error if dimensions aren't given for a size`, () => {
            let browser = {};
            let config = {};
            let screenSize = new ScreenSize(browser, config);

            return screenSize.setSize('sm')
            .catch(e => {
                expect(e).to.deep.equal(new TractorError('Cannot find screen dimensions for "sm"'));
            });
        });
    })
});
