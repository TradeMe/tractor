// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/browser - description:', () => {
    it('should have the `get` action', () => {
        const get = description.actions.find(action => action.name === 'get');
        expect(get).to.not.equal(undefined);
    });

    it('should have the `refresh` action', () => {
        const refresh = description.actions.find(action => action.name === 'refresh');
        expect(refresh).to.not.equal(undefined);
    });

    it('should have the `setLocation` action', () => {
        const setLocation = description.actions.find(action => action.name === 'set location');
        expect(setLocation).to.not.equal(undefined);
    });

    it('should have the `getCurrentUrl` action', () => {
        const setLocation = description.actions.find(action => action.name === 'get current URL');
        expect(setLocation).to.not.equal(undefined);
    });

    it('should have the `waitForAngular` action', () => {
        const waitForAngular = description.actions.find(action => action.name === 'wait for Angular');
        expect(waitForAngular).to.not.equal(undefined);
    });

    it('should have the `pause` action', () => {
        const pause = description.actions.find(action => action.name === 'pause');
        expect(pause).to.not.equal(undefined);
    });

    it('should have the `sleep` action', () => {
        const sleep = description.actions.find(action => action.name === 'sleep');
        expect(sleep).to.not.equal(undefined);
    });

    it('should have the `send Delete key` action', () => {
        const sendDeleteKey = description.actions.find(action => action.name === 'send Delete key');
        expect(sendDeleteKey).to.not.equal(undefined);
    });

    it('should have the `send Enter key` action', () => {
        const sendEnterKey = description.actions.find(action => action.name === 'send Enter key');
        expect(sendEnterKey).to.not.equal(undefined);
    });

    it('should have the `send Space key` action', () => {
        const sendSpaceKey = description.actions.find(action => action.name === 'send Space key');
        expect(sendSpaceKey).to.not.equal(undefined);
    });

    it('should have the `focus next` action', () => {
        const focusNext = description.actions.find(action => action.name === 'focus next');
        expect(focusNext).to.not.equal(undefined);
    });

    it('should have the `focus previous` action', () => {
        const focusPrevious = description.actions.find(action => action.name === 'focus previous');
        expect(focusPrevious).to.not.equal(undefined);
    });
});
