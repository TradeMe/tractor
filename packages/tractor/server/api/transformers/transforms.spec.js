/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import fileStructure from '../../file-structure';

// Under test:
import transforms from './transforms';

describe('server/api/transformers: transforms:', () => {
    describe('transforms.transformMetadata:', () => {
        it('should update the name of a file in it\'s metadata', () => {
            let file = {
                ast: {
                    comments: [{
                        value: JSON.stringify({
                            name: 'old name'
                        })
                    }]
                },
                save: _.noop
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            return transforms.transformMetadata(file, null, 'old name', 'new name')
            .then(() => {
                let [comment] = file.ast.comments;
                expect(JSON.parse(comment.value).name).to.equal('new name');

                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                file.save.restore();
            });
        });

        it('should update the name of a referenced file in another file\'s metadata', () => {
            let file = {
                ast: {
                    comments: [{
                        value: JSON.stringify({
                            components: [{
                                name: 'old name'
                            }]
                        })
                    }]
                },
                save: _.noop
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            return transforms.transformMetadata(file, 'components', 'old name', 'new name')
            .then(() => {
                let [comment] = file.ast.comments;
                let [component] = JSON.parse(comment.value).components;
                expect(component.name).to.equal('new name');

                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                file.save.restore();
            });
        });
    });

    describe('transforms.transformIdentifiers:', () => {
        it('should update the name of a file in it\'s AST', () => {
            let file = {
                ast: {
                    type: 'Program',
                    body: [{
                        type: 'VariableDeclaration',
                        declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'oldName'
                            },
                            init: null
                        }],
                        kind: 'var'
                    }]
                },
                save: _.noop
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            return transforms.transformIdentifiers(file, 'oldName', 'newName')
            .then(() => {
                let [variableDeclarations] = file.ast.body;
                let [variableDeclaration] = variableDeclarations.declarations;
                expect(variableDeclaration.id.name).to.equal('newName');

                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                file.save.restore();
            });
        });
    });

    describe('transforms.transformReferenceIdentifiers:', () => {
        it('should update the name of a referenced file in another file\'s AST', () => {
            let oldReferences = fileStructure.references;
            let oldAllFilesByPath = fileStructure.allFilesByPath;

            let file = {
                ast: {
                    type: 'Program',
                    body: [{
                        type: 'VariableDeclaration',
                        declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'oldName'
                            },
                            init: null
                        }],
                        kind: 'var'
                    }]
                },
                save: _.noop
            };

            fileStructure.references = {
                'some/path/to/file': ['some/path/to/other-file']
            };
            fileStructure.allFilesByPath = {
                'some/path/to/other-file': file
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            return transforms.transformReferenceIdentifiers('some/path/to/file', 'oldName', 'newName')
            .then(() => {
                let [variableDeclaration] = fileStructure.allFilesByPath['some/path/to/other-file'].ast.body;
                let [VariableDeclarator] = variableDeclaration.declarations;

                expect(VariableDeclarator.id.name).to.equal('newName');
                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                fileStructure.references = oldReferences;
                fileStructure.allFilesByPath = oldAllFilesByPath;
            });
        });

        it('should do nothing if a file isn\'t referenced by any other files:', () => {
            let oldReferences = fileStructure.references;

            fileStructure.references = {};
            sinon.spy(Promise, 'map');

            return transforms.transformReferenceIdentifiers('some/path/to/file', 'oldName', 'newName')
            .then(() => {
                expect(Promise.map).to.have.been.calledWith([]);
            })
            .finally(() => {
                Promise.map.restore();

                fileStructure.references = oldReferences;
            });
        });
    });

    describe('transforms.transformReferences:', () => {
        it('should update the name of a referenced sibling file\'s path in another file\'s AST', () => {
            let oldReferences = fileStructure.references;
            let oldAllFilesByPath = fileStructure.allFilesByPath;

            let file = {
                ast: {
                    comments: [{
                        value: JSON.stringify({
                            components: [{
                                name: 'old name'
                            }]
                        })
                    }],
                    type: 'Program',
                    body: [{
                        type: 'VariableDeclaration',
                        declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'old name'
                            },
                            init: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'require'
                                },
                                arguments: [{
                                    type: 'Literal',
                                    value: './oldName',
                                    raw: '\'./oldName\''
                                }]
                            }
                        }],
                        kind: 'var'
                    }]
                },
                path: 'some/path/to/sibling-file',
                save: _.noop
            };

            fileStructure.references = {
                'some/path/to/oldName': ['some/path/to/sibling-file']
            };
            fileStructure.allFilesByPath = {
                'some/path/to/sibling-file': file
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            return transforms.transformReferences('components', 'some/path/to/oldName', 'some/path/to/newName', 'old name', 'new name')
            .then(() => {
                let [variableDeclaration] = fileStructure.allFilesByPath['some/path/to/sibling-file'].ast.body;
                let [VariableDeclarator] = variableDeclaration.declarations;
                let [argument] = VariableDeclarator.init.arguments;

                expect(argument.value).to.equal('./newName');
                expect(argument.raw).to.equal('\'./newName\'');
                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                fileStructure.references = oldReferences;
                fileStructure.allFilesByPath = oldAllFilesByPath;
            });
        });

        it('should update the name of a referenced descendent file\'s path in another file\'s AST', () => {
            let oldReferences = fileStructure.references;
            let oldAllFilesByPath = fileStructure.allFilesByPath;

            let file = {
                ast: {
                    comments: [{
                        value: JSON.stringify({
                            components: [{
                                name: 'old name'
                            }]
                        })
                    }],
                    type: 'Program',
                    body: [{
                        type: 'VariableDeclaration',
                        declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'old name'
                            },
                            init: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'require'
                                },
                                arguments: [{
                                    type: 'Literal',
                                    value: '../oldName',
                                    raw: '\'../oldName\''
                                }]
                            }
                        }],
                        kind: 'var'
                    }]
                },
                path: 'some/path/to/descendent/file',
                save: _.noop
            };

            fileStructure.references = {
                'some/path/to/oldName': ['some/path/to/descendent/file']
            };
            fileStructure.allFilesByPath = {
                'some/path/to/descendent/file': file
            };

            sinon.stub(file, 'save').returns(Promise.resolve());

            return transforms.transformReferences('components', 'some/path/to/oldName', 'some/path/to/newName', 'old name', 'new name')
            .then(() => {
                let [variableDeclaration] = fileStructure.allFilesByPath['some/path/to/descendent/file'].ast.body;
                let [VariableDeclarator] = variableDeclaration.declarations;
                let [argument] = VariableDeclarator.init.arguments;

                expect(argument.value).to.equal('../newName');
                expect(argument.raw).to.equal('\'../newName\'');
                expect(file.save).to.have.been.called();
            })
            .finally(() => {
                fileStructure.references = oldReferences;
                fileStructure.allFilesByPath = oldAllFilesByPath;
            });
        });

        it('should do nothing if a file isn\'t referenced by any other files:', () => {
            let oldReferences = fileStructure.references;

            fileStructure.references = {};
            sinon.spy(Promise, 'map');

            return transforms.transformReferences('components', 'some/path/to/oldName', 'some/path/to/newName', 'oldName', 'newName')
            .then(() => {
                expect(Promise.map).to.have.been.calledWith([]);
            })
            .finally(() => {
                Promise.map.restore();

                fileStructure.references = oldReferences;
            });
        });
    });
});
