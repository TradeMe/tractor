# Future plans

I ([phenomnomnominal](https://github.com/phenomnomnominal)) have been toiling away at **tractor** by myself for a number of years now! I still have a lot I'd like to do with it:

* More test types! We should be able to write plugins to enable performance testing, accessibility testing, chaos testing, etc.

* Make the plugins useful without **tractor**. Improve the `[@tractor/plugin-loader]` to just accept a Protractor config object.

* Make it pretty. It's currently pretty damn ugly. Probably rewrite in Angular at the same time.

* Make it an Electron app?

* Automate the installing of Java SDK, hostfile modifications for `[@tractor-plugins/mock-requests](https://github.com/phenomnomnominal/tractor-plugin-mock-requests)` etc.

* Make it type-safe, by rewriting in TypeScript. This would probably enable removing the janky as `@tractor/dependency-injection`.

* Introduce more JS. That way we can get users used to seeing the actual underlying code, rather than the UI.

* Move (all?) the plugins to this repo. They're a bit annoying to develop as they are right now.

* Move parsing/codegen from the client to the server. There's no need for it to be on the client, and passing huge files between client/server is a bit silly.

* Moar speed! A lot of the implementation is fairly naive, and could definitely be made faster. `@tractor/file-structure` seems like an obvious place to start.

* Moar docs.

* Kill `tractor init`. There doesn't seem to be a good need for this anymore, each plugin should be responsible for making sure that any files that it needs are created JIT.

* Long term - evaluate if it's even needed anymore? Or maybe just move away from Protractor? Cypress.io and Puppeteer have come around since I started this journey, there may be better tools.
