import { MockRequests } from './mock-requests';

export default function addHooks (browser, config, cucumber) {
    cucumber.Before((scenario, callback) => {
        global.mockRequests = new MockRequests(browser, config);
        callback();
    });

    cucumber.After((scenario, callback) => {
        global.mockRequests.clear();
        callback();
    });
}
addHooks['@Inject'] = ['browser', 'config', 'cucumber'];
