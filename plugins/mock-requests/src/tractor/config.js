// Constants:
const DEFAULT_DIRECTORY = './tractor/mock-requests';
const DEFAULT_DOMAIN = 'localhost';
const DEFAULT_HEADERS = {};
const DEFAULT_MINPORT = 30000;
const DEFAULT_MAXPORT = 40000;

export function config (tractorConfig) {
    tractorConfig.mockRequests = tractorConfig.mockRequests || {};
    let { mockRequests } = tractorConfig;
    mockRequests.directory = mockRequests.directory || DEFAULT_DIRECTORY;
    mockRequests.domain = mockRequests.domain || DEFAULT_DOMAIN;
    mockRequests.headers = mockRequests.headers || DEFAULT_HEADERS;
    mockRequests.minPort = mockRequests.minPort || DEFAULT_MINPORT;
    mockRequests.maxPort = mockRequests.maxPort || DEFAULT_MAXPORT;
    
    return mockRequests;
}
