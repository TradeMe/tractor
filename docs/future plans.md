# Future plans

I ([phenomnomnominal](https://github.com/phenomnomnominal)) have been toiling away at **tractor** by myself for a number of years now! I still have a lot I'd like to do with it:

* More test types! We should be able to write plugins to enable performance testing, accessibility testing, chaos testing, etc.

* Make it pretty. It's currently pretty damn ugly. Probably rewrite in Angular at the same time.

* Make it an Electron app? Or more likely a browser extension!

* Automate the installing of Java SDK, hostfile modifications for `@tractor-plugins/mock-requests` etc.

* Introduce more JS. That way we can get users used to seeing the actual underlying code, rather than the UI.

* Move parsing/codegen from the client to the server. There's no need for it to be on the client, and passing huge files between client/server is a bit silly.

* Moar docs.

* Kill `tractor init`. There doesn't seem to be a good need for this anymore, each plugin should be responsible for making sure that any files that it needs are created JIT.

* Long term - evaluate if it's even needed anymore? Or maybe just move away from Protractor? Cypress.io and Puppeteer have come around since I started this journey, there may be better tools.
