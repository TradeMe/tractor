'use strict';

// Config:
var config = require('../utils/get-config');

module.exports = function (req, res) {
    res.send(JSON.stringify(config));
};
