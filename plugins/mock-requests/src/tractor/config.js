// Dependencies:
import { info } from '@tractor/logger';

// Constants:
const DEFAULT_DIRECTORY = './tractor/mock-requests';
const DEFAULT_DOMAIN = 'localhost';
const DEFAULT_HEADERS = {};

export function config (tractorConfig) {
    tractorConfig.mockRequests = tractorConfig.mockRequests || {};
    let { mockRequests } = tractorConfig;
    mockRequests.directory = mockRequests.directory || DEFAULT_DIRECTORY;
    mockRequests.domain = mockRequests.domain || DEFAULT_DOMAIN;
    mockRequests.headers = mockRequests.headers || DEFAULT_HEADERS;
    if (mockRequests.port) {
        info('`mockRequests.port` is no longer needed, and will be ignored. The port will be assigned randomly.');
    }
    return mockRequests;
}
