/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

// Under test:
import addHooks from './add-hooks';

describe('tractor-plugin-screen-size - addHooks:', () => {
    it('should do nothing if there is no config', () => {
        let cucumber = {};
        let config = {};

        expect(() => {
            addHooks(cucumber, config);
        }).to.not.throw();
    });

    it('should add a Before hook for each screen size in the config', () => {
        let config = {
            tags: [],
            screenSizes: {
                sm: 360,
                md: 768
            }
        };
        let cucumber = {
            Before: () => {}
        };

        sinon.stub(cucumber, 'Before');

        addHooks(cucumber, config);

        expect(cucumber.Before).to.have.been.calledWith({ tags: ['@screen-size:sm'] });
        expect(cucumber.Before).to.have.been.calledWith({ tags: ['@screen-size:md'] });
    });

    it('should resize the screen when the hook is called', () => {
        let config = {
            tags: [],
            screenSizes: {
                sm: 360
            }
        };
        let hooks = [];
        let cucumber = {
            Before: (tag, hook) => {
                hooks.push(hook);
            }
        };

        sinon.stub(ScreenSize.prototype, 'setSize');

        addHooks(cucumber, config);

        let [hook] = hooks;
        hook();

        expect(ScreenSize.prototype.setSize).to.have.been.calledWith('sm');

        ScreenSize.prototype.setSize.restore();
    });
});
