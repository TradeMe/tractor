# tractor

[tractor](https://www.npmjs.com/org/tractor) is a UI around [Protractor](http://angular.github.io/protractor/) to help write E2E tests for [Angular](https://angular.io/) applications without needing to know JavaScript.

**tractor** started as a proof-of-concept that we could generate our tests with a UI, and got a bit out of control (as proof-of-concepts tend to do!). See [here](http://phenomnomnominal.github.io/#/posts/how-i-tricked-our-testers-into-becoming-java-script-developers) for some (quite outdated) extra background info as to why it exists, and [here](https://github.com/TradeMe/tractor/tree/master/docs/future%20plans.md) for some ideas on where this project may go!

## Why?

E2E tests are notoriously hard to build and maintain. We can minimise the pain by centralising the tooling, and generating as much of the code as possible. Tests should be able to be written and modified by anyone, not just those with years of experience with JavaScript.

**tractor** should

* Leverage standard patterns for E2E tests, e.g. [Page Objects](https://github.com/phenomnomnominal/tractor-plugin-page-objects)

* Enable as many different types of tests as possible, e.g. [Visual Regression](https://github.com/phenomnomnominal/tractor-plugin-visual-regression)

* Augment [Protractor](http://angular.github.io/protractor/), but not get in the way, and always stay as deletable as possible!
