// Dependencies:
import { browserInfo } from './browser-info';
import { debug } from './debug';

export async function attachAfterEach () {
    // HACK:
    // This is a bit weird. We want to run some code after each Mocha spec runs, 
    // so we can add extra data to the test report.
    //
    // FIRST ATTEMPT: Use Mocha's `afterEach` in a Protractor plugin.
    // Tried calling `afterEach in the  `onPrepare` lifecycle took, but
    // the global Mocha hooks aren't available yet.
    //
    // SECOND ATTEMPT: Move hooks to a separate file.
    // By moving the hook calls to a separate file, we can push that file into
    // the list of specs. This works well when running all the specs in serial,
    // but stops working when running them in parallel, as the separate file will
    // be run in a separate process.
    //
    // THIRD ATTEMPT: Use Mocha's `after` hook in a Protractor plugin.
    // In the `postTest` part of a Protractor plugin, we have access to the
    // `after` hook, so we can use that to attach the hook. Unfortunately,
    // the `after` hook happens outside the context of the running test, 
    // so you can't attach the information to the right test.
    // 
    // FOURTH ATTEMPT: Use Mocha's `afterEach` hook in a Protractor plugin.
    // In the `postTest` part of a Protractor plugin, we have access to the
    // `afterEach` hook. That's great, and we also have access to the right
    // test context. Unfortunately, the hook will be added for *each* test!
    // So we have to add this flag and make sure we only add the hook once 
    // per process:
    let isCalled = false;

    // Prefer FunctionExpression over ArrowFunctionExpression as
    // Mocha passes the context around with `this`
    afterEach(async function () {
        if (!isCalled) {
            isCalled = true;
            await browserInfo(this);
            debug(this);
        }
    });
}
