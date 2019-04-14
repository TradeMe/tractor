'use strict';
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
  allScriptsTimeout: 11000,
  capabilities: {
    browserName: 'chrome',
    // Explicitly turning off parallelism as these tests break 😔
    shardTestFiles: false
    // These tests won't work in headless 😔
  },
  mochaOpts: {
      timeout: 30000
  },
  directConnect: true,
  SELENIUM_PROMISE_MANAGER: false
});
