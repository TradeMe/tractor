/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var saveFeatureFile = require('./save-feature-file');

describe('server/actions: save-feature-file:', function () {
    it('should build the correct `featurePath` and save the `feature` to a ".feature" file', function () {
        var childProcess = require('child_process');
        var fs = require('fs');
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(['']));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'feature',
                feature: 'feature'
            }
        };
        var response = {
            send: noop
        };

        return saveFeatureFile(request, response)
        .then(function () {
            expect(fs.writeFileAsync).to.have.been.calledWith('e2e_tests/features/feature.feature', 'feature');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should replace any occurences of "%%NEWLINE%%" with a new line', function () {
        var childProcess = require('child_process');
        var fs = require('fs');
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(['']));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'feature',
                feature: '%%NEWLINE%%'
            }
        };
        var response = {
            send: noop
        };

        return saveFeatureFile(request, response)
        .then(function () {
            expect(fs.writeFileAsync).to.have.been.calledWith('e2e_tests/features/feature.feature', require('os').EOL);
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should execute the "cucumber" command on the saved file', function () {
        var childProcess = require('child_process');
        var fs = require('fs');
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(['']));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'feature',
                feature: '%%NEWLINE%%'
            }
        };
        var response = {
            send: noop
        };

        return saveFeatureFile(request, response)
        .then(function () {
            expect(childProcess.execAsync).to.have.been.calledWith('node node_modules/cucumber/bin/cucumber e2e_tests/features/feature.feature');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should return an error if the "cucumber" execution fails', function () {
        var childProcess = require('child_process');
        var fs = require('fs');
        var logging = require('../utils/logging');
        sinon.stub(childProcess, 'execAsync').returns(Promise.reject(new Error()));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(logging, 'error');
        var request = {
            body: {
                feature: ''
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        return saveFeatureFile(request, response)
        .then(function () {
            expect(response.status).to.have.been.calledWith(500);
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.error).to.equal('Generating Cucumber stubs failed.');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            logging.error.restore();
        });
    });

    it('should save a new step file for each generated stub', function () {
        var childProcess = require('child_process');
        var eol = require('os').EOL;
        var fs = require('fs');
        var step = 'this.When(/^some step$/, function (done) {' + eol +
                   '  done.pending();' + eol +
                   '});' + eol +
                   '' + eol +
                   'this.Then(/^some expectation$/, function (done) {' + eol +
                   '  done.pending();' + eol +
                   '});';
        var request = {
            body: {
                name: '',
                feature: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve([step]));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());

        return saveFeatureFile(request, response)
        .then(function () {
            var firstStub = fs.writeFileAsync.getCall(1).args[1];
            expect(firstStub.indexOf('this.When(/^some step$/, function (done) {') > -1).to.equal(true);
            var secondStub = fs.writeFileAsync.getCall(2).args[1];
            expect(secondStub.indexOf('this.Then(/^some expectation$/, function (done) {') > -1).to.equal(true);
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should give the file a name based on the step definition name', function () {
        var childProcess = require('child_process');
        var eol = require('os').EOL;
        var fs = require('fs');
        var step = 'this.When(/^some step$/, function (done) {' + eol +
                   '  done.pending();' + eol +
                   '});';
        var request = {
            body: {
                name: '',
                feature: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve([step]));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());

        return saveFeatureFile(request, response)
        .then(function () {
            var path = fs.writeFileAsync.getCall(1).args[0];
            expect(path).to.equal('e2e_tests/step_definitions/WhenSomeStep.step.js');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should strip out any coloured characters from the "cucumber" output', function () {
        var childProcess = require('child_process');
        var eol = require('os').EOL;
        var fs = require('fs');
        var step = '[33mthis.When(/^some step$/, function (done) {[0m' + eol +
                   '[33m  done.pending();[0m' + eol +
                   '[33m});[0m';
        var request = {
            body: {
                name: '',
                feature: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve([step]));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());

        return saveFeatureFile(request, response)
        .then(function () {
            var stub = fs.writeFileAsync.getCall(1).args[1];
            expect(stub.indexOf('this.When(/^some step$/, function (done) {') > -1).to.equal(true);
            expect(stub.indexOf('[33m') === -1).to.equal(true);
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should wrap everything in a `module.exports` statement', function () {
        var childProcess = require('child_process');
        var eol = require('os').EOL;
        var fs = require('fs');
        var step = 'this.When(/^some step$/, function (done) {' + eol +
                   '  done.pending();' + eol +
                   '});';
        var request = {
            body: {
                name: '',
                feature: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve([step]));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve());

        return saveFeatureFile(request, response)
        .then(function () {
            var stub = fs.writeFileAsync.getCall(1).args[1];
            expect(stub.indexOf('module.exports = function () {') > -1).to.equal(true);
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should not save a new file if one with the same name already exists', function () {
        var childProcess = require('child_process');
        var eol = require('os').EOL;
        var fs = require('fs');
        var step = 'this.When(/^some step$/, function (done) {' + eol +
                   '  done.pending();' + eol +
                   '});';
        var request = {
            body: {
                name: '',
                feature: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve([step]));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve(['WhenSomeStep.step.js']));

        return saveFeatureFile(request, response)
        .then(function () {
            expect(fs.writeFileAsync.callCount).to.equal(1);
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });

    it('should return a success message when the stubs are generated', function () {
        var childProcess = require('child_process');
        var fs = require('fs');
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(['']));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(fs, 'readdirAsync').returns(Promise.resolve([]));
        var request = {
            body: {
                name: '',
                feature: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.spy(response, 'send');

        return saveFeatureFile(request, response)
        .then(function () {
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.message).to.equal('Cucumber stubs generated.');
        })
        .finally(function () {
            childProcess.execAsync.restore();
            fs.writeFileAsync.restore();
            fs.readdirAsync.restore();
        });
    });
});
