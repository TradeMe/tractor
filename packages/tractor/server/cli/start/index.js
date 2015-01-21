'use strict';

// Dependencies:
var application = require('../../application');

module.exports = function () {
		return function () {
				application.start();
		};
};
