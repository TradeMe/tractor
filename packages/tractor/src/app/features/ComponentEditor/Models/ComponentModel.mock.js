'use strict';

var MockNotImplementedError = require('../../../Errors/MockNotImplementedError');

var MockComponentModel = function MockComponentModel () {
};
MockComponentModel.prototype.addElement = function () {
    throw new MockNotImplementedError('`MockComponentModel.addElement` is not implemented.');
};
MockComponentModel.prototype.removeElement = function () {
    throw new MockNotImplementedError('`MockComponentModel.removeElement` is not implemented.');
};
MockComponentModel.prototype.addAction = function () {
    throw new MockNotImplementedError('`MockComponentModel.addAction` is not implemented.');
};
MockComponentModel.prototype.removeAction = function () {
    throw new MockNotImplementedError('`MockComponentModel.removeAction` is not implemented.');
};
MockComponentModel.prototype.getAllVariableNames = function () {
    throw new MockNotImplementedError('`MockComponentModel.getAllVariableNames` is not implemented.');
};

module.exports = MockComponentModel;
