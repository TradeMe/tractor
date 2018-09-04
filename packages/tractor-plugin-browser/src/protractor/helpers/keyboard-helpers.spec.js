// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Under test:
import { addKeyboardHelpers } from './keyboard-helpers';

describe('@tractor-plugins/browser - keyboard-helpers:', () => {
    describe('`sendDeleteKey`', () => {
        it('should trigger an action that types the Delete key', () => {
            const action = ineeda(); 
            const actions = ineeda({ sendKeys: () => action });
            const browser = ineeda({ actions: () => actions });
            const DELETE = ineeda();
            const Keys = ineeda({ DELETE });

            addKeyboardHelpers(browser, Keys);
    
            browser.sendDeleteKey();

            expect(actions.sendKeys).to.have.been.calledWith(DELETE);
            expect(action.perform).to.have.been.called();
        });
    });

    describe('`sendEnterKey`', () => {
        it('should trigger an action that types the Delete key', () => {
            const action = ineeda(); 
            const actions = ineeda({ sendKeys: () => action });
            const browser = ineeda({ actions: () => actions });
            const ENTER = ineeda();
            const Keys = ineeda({ ENTER });

            addKeyboardHelpers(browser, Keys);
    
            browser.sendEnterKey();

            expect(actions.sendKeys).to.have.been.calledWith(ENTER);
            expect(action.perform).to.have.been.called();
        });
    });
});
