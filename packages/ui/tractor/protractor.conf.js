'use strict';
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
  allScriptsTimeout: 11000,
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  mochaOpts: {
      timeout: 30000
  },
  SELENIUM_PROMISE_MANAGER: false
});
