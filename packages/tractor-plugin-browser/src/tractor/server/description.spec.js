// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/browser - description:', () => {
    it('should have the `get` action', () => {
        let get = description.actions.find(action => action.name === 'get');
        expect(get).to.not.be.undefined();
    });

    it('should have the `refresh` action', () => {
        let refresh = description.actions.find(action => action.name === 'refresh');
        expect(refresh).to.not.be.undefined();
    });

    it('should have the `setLocation` action', () => {
        let setLocation = description.actions.find(action => action.name === 'set location');
        expect(setLocation).to.not.be.undefined();
    });

    it('should have the `getCurrentUrl` action', () => {
        let setLocation = description.actions.find(action => action.name === 'get current URL');
        expect(setLocation).to.not.be.undefined();
    });

    it('should have the `waitForAngular` action', () => {
        let waitForAngular = description.actions.find(action => action.name === 'wait for Angular');
        expect(waitForAngular).to.not.be.undefined();
    });

    it('should have the `pause` action', () => {
        let pause = description.actions.find(action => action.name === 'pause');
        expect(pause).to.not.be.undefined();
    });

    it('should have the `sleep` action', () => {
        let sleep = description.actions.find(action => action.name === 'sleep');
        expect(sleep).to.not.be.undefined();
    });

    it('should have the `send Delete key` action', () => {
        let sendDeleteKey = description.actions.find(action => action.name === 'send Delete key');
        expect(sendDeleteKey).to.not.be.undefined();
    });

    it('should have the `send Enter key` action', () => {
        let sendEnterKey = description.actions.find(action => action.name === 'send Enter key');
        expect(sendEnterKey).to.not.be.undefined();
    });
});
