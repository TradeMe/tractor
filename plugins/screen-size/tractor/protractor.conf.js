'use strict';
exports.config = require('@tractor/plugin-loader').plugin({
  allScriptsTimeout: 11000,
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  params: {
    debug: false
  },
  SELENIUM_PROMISE_MANAGER: false
});
