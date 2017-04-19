/* globals window */

// Constants:
const EVENTS = ['abort', 'error', 'load', 'loadend', 'loadstart', 'progress', 'readystatechange', 'timeout'];

// Dependencies:
import FakeXMLHttpRequest from 'fake-xml-http-request';

window.__tractor__ = (function tractorMockRequests (tractor) {
    let originalXHR = window.XMLHttpRequest;
    let originalOpen = originalXHR.prototype.open;
    originalXHR.prototype.open = function (method, url) {
        let mock = tractor.getMatchingMock(method, url);

        if (!mock) {
            let message = `Unexpected "${method}" request to "${url}".`;
            console.error(message);
        }

        if (!mock || mock && mock.passThrough) {
            return originalOpen.apply(this, arguments);
        }

        let real = this;
        let fake = new FakeXMLHttpRequest();
        Object.setPrototypeOf(real, FakeXMLHttpRequest.prototype);

        real.send = function () {
            copyEvents(real, fake);
            FakeXMLHttpRequest.prototype.send.apply(this, arguments);
            fake.send.apply(fake, arguments);
            FakeXMLHttpRequest.prototype.respond.call(this, mock.status, mock.headers, mock.body);
            fake.respond.apply(fake, arguments);
        }

        copyEvents(real, fake);
        FakeXMLHttpRequest.prototype.open.apply(this, arguments);
        fake.open.apply(fake, arguments);
    };

    return tractor;

    function copyEvents (real, fake) {
        EVENTS.forEach(event => {
            var eventKey = `on${event}`;
            var handler = real[eventKey];
            if (typeof handler === 'function') {
                fake[eventKey] = handler.bind(real);
            }
        });
    }
})(window.__tractor__);
