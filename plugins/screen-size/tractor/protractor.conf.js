'use strict';
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
  allScriptsTimeout: 11000,
  capabilities: {
    browserName: 'chrome'
  },
  mochaOpts: {
      timeout: 30000
  },
  directConnect: true,
  SELENIUM_PROMISE_MANAGER: false
});
