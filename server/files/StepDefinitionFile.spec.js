/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import JavaScriptFile from './JavaScriptFile';
import path from 'path';

// Under test:
import StepDefinitionFile from './StepDefinitionFile';

describe('server/files: StepDefinitionFile:', () => {
    describe('StepDefinitionFile constructor:', () => {
        it('should create a new StepDefinitionFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new StepDefinitionFile(filePath, directory);

            expect(file).to.be.an.instanceof(StepDefinitionFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new StepDefinitionFile(filePath, directory);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });
    });

    describe('StepDefinitionFile.read:', () => {
        it('should read the file from disk', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {}
                }
            };
            let filePath = 'some/path';

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, directory);

            return file.read()
            .then(() => {
                expect(JavaScriptFile.prototype.read).to.have.been.called();
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
            });
        });

        it('should update the references between files', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {}
                }
            };
            let filePath = 'some/path';

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());
            sinon.stub(path, 'resolve').returns('resolved/path');

            let file = new StepDefinitionFile(filePath, directory);
            file.ast = {
                type: 'Program',
                body: [{
                    type: 'VariableDeclaration',
                    declarations: [{
                        type: 'VariableDeclarator',
                        id: {
                            type: 'Identifier',
                            name: 'someReference'
                        },
                        init: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'require'
                            },
                            arguments: [{
                                type: 'Literal',
                                value: './path/to/reference',
                                raw: '\\"./path/to/reference\\"'
                            }]
                        }
                    }],
                    kind: 'var'
                }]
            };

            return file.read()
            .then(() => {
                expect(directory.fileStructure.references['resolved/path']).to.deep.equal(['some/path']);
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
                path.resolve.restore();
            });
        });

        it('should remove any reference that are no longer relevant', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {
                        'resolved/path': ['some/path']
                    }
                }
            };
            let filePath = 'some/path';

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, directory);
            file.ast = {
                type: 'Program',
                body: []
            };

            return file.read()
            .then(() => {
                expect(directory.fileStructure.references['resolved/path']).to.deep.equal([]);
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
            });
        });
    });

    describe('StepDefinitionFile.save:', () => {
        it('should save the file to disk', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {}
                }
            };
            let filePath = 'some/path';

            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, directory);

            return file.save()
            .then(() => {
                expect(JavaScriptFile.prototype.save).to.have.been.called();
            })
            .finally(() => {
                JavaScriptFile.prototype.save.restore();
            });
        });

        it('should update the references between files', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {}
                }
            };
            let filePath = 'some/path';

            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(path, 'resolve').returns('resolved/path');

            let file = new StepDefinitionFile(filePath, directory);
            file.ast = {
                type: 'Program',
                body: [{
                    type: 'VariableDeclaration',
                    declarations: [{
                        type: 'VariableDeclarator',
                        id: {
                            type: 'Identifier',
                            name: 'someReference'
                        },
                        init: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'require'
                            },
                            arguments: [{
                                type: 'Literal',
                                value: './path/to/reference',
                                raw: '\\"./path/to/reference\\"'
                            }]
                        }
                    }],
                    kind: 'var'
                }]
            };

            return file.save()
            .then(() => {
                expect(directory.fileStructure.references['resolved/path']).to.deep.equal(['some/path']);
            })
            .finally(() => {
                JavaScriptFile.prototype.save.restore();
                path.resolve.restore();
            });
        });

        it('should remove any reference that are no longer relevant', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {
                        'resolved/path': ['some/path']
                    }
                }
            };
            let filePath = 'some/path';

            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, directory);
            file.ast = {
                type: 'Program',
                body: []
            };

            return file.save()
            .then(() => {
                expect(directory.fileStructure.references['resolved/path']).to.deep.equal([]);
            })
            .finally(() => {
                JavaScriptFile.prototype.save.restore();
            });
        });
    });
});
