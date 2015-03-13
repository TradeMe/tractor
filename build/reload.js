'use strict';

// Config:
var config = require('./config.js');

// Dependencies:
var browserSync = require('browser-sync');

module.exports = reload;

function reload (reportTaskDone) {
    browserSync({
        proxy: 'localhost:4000'
    });
    reportTaskDone();
}
