// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { ActionSequence, Key, ProtractorBrowser } from 'protractor';

// Under test:
import { addKeyboardHelpers } from './keyboard-helpers';

describe('@tractor-plugins/browser - keyboard-helpers:', () => {
    describe('sendDeleteKey()', () => {
        it('should trigger an action that triggers the Delete key', () => {
            const action = ineeda<ActionSequence>();
            const actions = ineeda<ActionSequence>({ sendKeys: (): ActionSequence => action });
            const browser = ineeda<ProtractorBrowser>({ actions: (): ActionSequence => actions });

            addKeyboardHelpers(browser);

            browser.sendDeleteKey();

            expect(actions.sendKeys).to.have.been.calledWith(Key.chord(Key.DELETE));
            expect((action.perform as sinon.SinonStub).callCount > 0).to.equal(true);
        });
    });

    describe('sendEnterKey()', () => {
        it('should trigger an action that triggers the Enter key', () => {
            const action = ineeda<ActionSequence>();
            const actions = ineeda<ActionSequence>({ sendKeys: (): ActionSequence => action });
            const browser = ineeda<ProtractorBrowser>({ actions: (): ActionSequence => actions });

            addKeyboardHelpers(browser);

            browser.sendEnterKey();

            expect(actions.sendKeys).to.have.been.calledWith(Key.chord(Key.ENTER));
            expect((action.perform as sinon.SinonStub).callCount > 0).to.equal(true);
        });
    });

    describe('sendSpaceKey()', () => {
        it('should trigger an action that triggers the Space key', () => {
            const action = ineeda<ActionSequence>();
            const actions = ineeda<ActionSequence>({ sendKeys: (): ActionSequence => action });
            const browser = ineeda<ProtractorBrowser>({ actions: (): ActionSequence => actions });

            addKeyboardHelpers(browser);

            browser.sendSpaceKey();

            expect(actions.sendKeys).to.have.been.calledWith(Key.chord(Key.SPACE));
            expect((action.perform as sinon.SinonStub).callCount > 0).to.equal(true);
        });
    });

    describe('focusNext()', () => {
        it('should trigger an action that triggers the Tab key', () => {
            const action = ineeda<ActionSequence>();
            const actions = ineeda<ActionSequence>({ sendKeys: (): ActionSequence => action });
            const browser = ineeda<ProtractorBrowser>({ actions: (): ActionSequence => actions });

            addKeyboardHelpers(browser);

            browser.focusNext();

            expect(actions.sendKeys).to.have.been.calledWith(Key.chord(Key.TAB));
            expect((action.perform as sinon.SinonStub).callCount > 0).to.equal(true);
        });
    });

    describe('focusPrevious()', () => {
        it('should trigger an action that triggers the Tab key + the Shift key', () => {
            const action = ineeda<ActionSequence>();
            const actions = ineeda<ActionSequence>({ sendKeys: (): ActionSequence => action });
            const browser = ineeda<ProtractorBrowser>({ actions: (): ActionSequence => actions });

            addKeyboardHelpers(browser);

            browser.focusPrevious();

            expect(actions.sendKeys).to.have.been.calledWith(Key.chord(Key.SHIFT, Key.TAB));
            expect((action.perform as sinon.SinonStub).callCount > 0).to.equal(true);
        });
    });
});
