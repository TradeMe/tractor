'use strict';

var notify = require('gulp-notify');

module.exports = function() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
      title: "Error",
      message: "<%= error %>"
  }).apply(this, args);

  this.emit('end');
};
