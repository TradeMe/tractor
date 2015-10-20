/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import JavaScriptFile from './JavaScriptFile';

// Under test:
import ComponentFile from './ComponentFile';

describe('server/files: ComponentFile:', () => {
    describe('ComponentFile constructor:', () => {
        it('should create a new ComponentFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new ComponentFile(filePath, directory);

            expect(file).to.be.an.instanceof(ComponentFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new ComponentFile(filePath, directory);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });
    });
});
