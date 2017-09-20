// Constants:
const DEFAULT_DIRECTORY = './tractor/mock-requests';
const DEFAULT_DOMAIN = 'localhost';
const DEFAULT_PORT = 8765;

export function config (tractorConfig) {
    tractorConfig.mockRequests = tractorConfig.mockRequests || {};
    let { mockRequests } = tractorConfig;
    mockRequests.directory = mockRequests.directory || DEFAULT_DIRECTORY;
    mockRequests.domain = mockRequests.domain || DEFAULT_DOMAIN;
    mockRequests.port = mockRequests.port || DEFAULT_PORT;
    return mockRequests;
}
