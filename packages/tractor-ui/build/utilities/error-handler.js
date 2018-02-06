'use strict';

// Dependencies:
var notify = require('gulp-notify');

module.exports = function() {
    notify.onError({
        title: "Error",
        message: "<%= error %>"
    }).apply(this, arguments);

    this.emit('end');
};
