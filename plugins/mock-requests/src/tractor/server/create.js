// Dependencies:
import { MockRequests } from './mock-requests/mock-requests';

export function create (browser, config) {
    let mockRequests = new MockRequests(browser, config.mockRequests);
    mockRequests.clear();
    return mockRequests;
}
create['@Inject'] = ['browser', 'config'];
