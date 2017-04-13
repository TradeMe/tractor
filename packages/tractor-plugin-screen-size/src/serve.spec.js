/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Under test:
import serve from './serve';

describe('tractor-plugin-screen-size - serve:', () => {
    it('should do nothing if there is no config', () => {
        let config = {};

        expect(() => {
            serve(config);
        }).to.not.throw();
    });

    it('should add tags for each screen size in the config', () => {
        let config = {
            tags: [],
            screenSizes: {
                sm: 360,
                md: 768
            }
        };

        serve(config);

        expect(config.tags.length).to.equal(2);

        let [smTag, mdTag] = config.tags;

        expect(smTag).to.equal('@screen-size:sm');
        expect(mdTag).to.equal('@screen-size:md');
    });
});
