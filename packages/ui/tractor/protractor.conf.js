'use strict';
const { tractor } = require('@tractor/core');

exports.config = tractor('../tractor.conf.js').plugin({
  allScriptsTimeout: 11000,
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: false,
    maxInstances: 4,
    chromeOptions: {
      args: [
        '--headless',
        '--disable-gpu'
      ]
    }
  },
  directConnect: true,
  mochaOpts: {
    timeout: 30000,
    reporterOptions: {
      autoOpen: false
    }
  },
  SELENIUM_PROMISE_MANAGER: false
});
