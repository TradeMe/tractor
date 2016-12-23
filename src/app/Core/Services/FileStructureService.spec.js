/*global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);

// Testing:
require('./FileStructureService');
var fileStructureService;

// Mocks:
var MockHttpResponseInterceptor = require('./HttpResponseInterceptor.mock');
var MockPersistentStateService = require('./PersistentStateService.mock');

describe('FileStructureService.js:', function () {
    var $httpBackend;
    var httpResponseInterceptor;
    var persistentStateService;

    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.module(function ($provide, $httpProvider) {
            httpResponseInterceptor = new MockHttpResponseInterceptor();
            $provide.factory('httpResponseInterceptor', function () {
                return httpResponseInterceptor;
            });
            persistentStateService = new MockPersistentStateService();
            $provide.factory('persistentStateService', function () {
                return persistentStateService;
            });
            $provide.factory('ComponentParserService', function () {
                return {};
            });
            $provide.factory('MockDataParserService', function () {
                return {};
            });

            $httpProvider.interceptors.push('httpResponseInterceptor');
        });

        angular.mock.inject(function (_$httpBackend_, _fileStructureService_) {
            $httpBackend = _$httpBackend_;
            fileStructureService = _fileStructureService_;
        });
    });

    describe('FileStructureService.getFileStructure:', function () {
        it('should get the current file structure from the server:', function (done) {
            var fileStructureMock = {
                directory: {
                    directories: []
                }
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns({});

            $httpBackend.whenGET('/components/file-structure').respond({});

            fileStructureService.getFileStructure('components')
            .then(function (fileStructure) {
                expect(fileStructure).to.equal(fileStructureMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the "open" state of the directories:', function (done) {
            var directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            var fileStructureMock = {
                directory: {
                    directories: [directory]
                }
            };
            var openDirectories = {
                '/path/to/open/directory': true
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);

            $httpBackend.whenGET('/components/file-structure').respond({});

            fileStructureService.getFileStructure('components')
            .then(function () {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.addDirectory:', function () {
        it('should make a request to add a new directory:', function (done) {
            var fileStructureMock = {
                directory: {
                    directories: []
                }
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns({});

            $httpBackend.whenPOST('/component/directory').respond({});

            fileStructureService.addDirectory('component')
            .then(function (fileStructure) {
                expect(fileStructure).to.equal(fileStructureMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the "open" state of the directories:', function (done) {
            var directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            var fileStructureMock = {
                directory: {
                    directories: [directory]
                }
            };
            var openDirectories = {
                '/path/to/open/directory': true
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);

            $httpBackend.whenPOST('/component/directory').respond({});

            fileStructureService.addDirectory('component')
            .then(function () {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.copyFile:', function () {
        it('should make a request to copy a file:', function (done) {
            var fileStructureMock = {
                directory: {
                    directories: []
                }
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns({});

            $httpBackend.whenPOST('/component/file/copy').respond({});

            fileStructureService.copyFile('component')
            .then(function (fileStructure) {
                expect(fileStructure).to.equal(fileStructureMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the "open" state of the directories:', function (done) {
            var directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            var fileStructureMock = {
                directory: {
                    directories: [directory]
                }
            };
            var openDirectories = {
                '/path/to/open/directory': true
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);

            $httpBackend.whenPOST('/component/file/copy').respond({});

            fileStructureService.copyFile('component')
            .then(function () {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.deleteDirectory:', function () {
        it('should make a request to delete a directory:', function (done) {
            var fileStructureMock = {
                directory: {
                    directories: []
                }
            };
            var options = {};

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns({});

            $httpBackend.whenDELETE('/component/directory').respond({});

            fileStructureService.deleteDirectory('component', options)
            .then(function (fileStructure) {
                expect(fileStructure).to.equal(fileStructureMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the "open" state of the directories:', function (done) {
            var directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            var fileStructureMock = {
                directory: {
                    directories: [directory]
                }
            };
            var openDirectories = {
                '/path/to/open/directory': true
            };
            var options = {};

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);

            $httpBackend.whenDELETE('/component/directory').respond({});

            fileStructureService.deleteDirectory('component', options)
            .then(function () {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.deleteFile:', function () {
        it('should make a request to delete a file:', function (done) {
            var fileStructureMock = {
                directory: {
                    directories: []
                }
            };
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns({});

            $httpBackend.whenDELETE('/component/file').respond({});

            fileStructureService.deleteFile('component')
            .then(function (fileStructure) {
                expect(fileStructure).to.equal(fileStructureMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the "open" state of the directories:', function (done) {
            var directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            var fileStructureMock = {
                directory: {
                    directories: [directory]
                }
            };
            var openDirectories = {
                '/path/to/open/directory': true
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);

            $httpBackend.whenDELETE('/component/file').respond({});

            fileStructureService.deleteFile('component')
            .then(function () {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    // describe('FileStructureService.editDirectoryPath:', function () {
    //     it('should make a request to edit the path of a directory:', function (done) {
    //         var fileStructureMock = {
    //             directory: {
    //                 directories: []
    //             }
    //         };
    //         var options = {};
    //
    //         sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
    //         sinon.stub(persistentStateService, 'get').returns({});
    //
    //         $httpBackend.whenPATCH('/component/directory/path').respond({});
    //
    //         fileStructureService.editDirectoryPath('component', options)
    //         .then(function (fileStructure) {
    //             expect(options.isDirectory).to.be.true();
    //             expect(fileStructure).to.equal(fileStructureMock);
    //             done();
    //         })
    //         .catch(done.fail);
    //
    //         $httpBackend.flush();
    //     });
    //
    //     it('should update the "open" state of the directories:', function (done) {
    //         var directory = {
    //             path: '/path/to/open/directory',
    //             directories: []
    //         };
    //         var fileStructureMock = {
    //             directory: {
    //                 directories: [directory]
    //             }
    //         };
    //         var openDirectories = {
    //             '/path/to/open/directory': true
    //         };
    //         var options = {};
    //
    //         sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
    //         sinon.stub(persistentStateService, 'get').returns(openDirectories);
    //
    //         $httpBackend.whenPATCH('/component/directory/path').respond({});
    //
    //         fileStructureService.editDirectoryPath('component', options)
    //         .then(function () {
    //             expect(directory.open).to.be.true();
    //             done();
    //         })
    //         .catch(done.fail);
    //
    //         $httpBackend.flush();
    //     });
    // });
    //
    // describe('FileStructureService.editFilePath:', function () {
    //     it('should make a request to edit the path of a file:', function (done) {
    //         var fileStructureMock = {
    //             directory: {
    //                 directories: []
    //             }
    //         };
    //
    //         sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
    //         sinon.stub(persistentStateService, 'get').returns({});
    //
    //         $httpBackend.whenPATCH('/component/file/path').respond({});
    //
    //         fileStructureService.editFilePath('component')
    //         .then(function (fileStructure) {
    //             expect(fileStructure).to.equal(fileStructureMock);
    //             done();
    //         })
    //         .catch(done.fail);
    //
    //         $httpBackend.flush();
    //     });
    //
    //     it('should update the "open" state of the directories:', function (done) {
    //         var directory = {
    //             path: '/path/to/open/directory',
    //             directories: []
    //         };
    //         var fileStructureMock = {
    //             directory: {
    //                 directories: [directory]
    //             }
    //         };
    //         var openDirectories = {
    //             '/path/to/open/directory': true
    //         };
    //
    //         sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
    //         sinon.stub(persistentStateService, 'get').returns(openDirectories);
    //
    //         $httpBackend.whenPATCH('/component/file/path').respond({});
    //
    //         fileStructureService.editFilePath('component')
    //         .then(function () {
    //             expect(directory.open).to.be.true();
    //             done();
    //         })
    //         .catch(done.fail);
    //
    //         $httpBackend.flush();
    //     });
    // });

    describe('FileStructureService.toggleOpenDirectory:', function () {
        it('should toggle the "open" state of a given directory path:', function () {
            var openDirectories = {
                'toggle/open/to/closed': true
            };

            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            sinon.stub(persistentStateService, 'set');

            fileStructureService.toggleOpenDirectory('toggle/open/to/closed');
            fileStructureService.toggleOpenDirectory('toggle/closed/to/open');

            expect(openDirectories['toggle/closed/to/open']).to.be.true();
            expect(openDirectories['toggle/open/to/closed']).to.be.undefined();

            persistentStateService.get.restore();
            persistentStateService.set.restore();
        });
    });
});
