// Constants:
const COMPONENTS = 'components';
const FEATURES = 'features';
const MOCK_DATA = 'mock-data';
const STEP_DEFINITIONS = 'step-definitions';

// Utilities:
import path from 'path';

const CONSTANTS = {
    COMPONENTS,
    FEATURES,
    MOCK_DATA,
    STEP_DEFINITIONS,

    CUCUMBER_COMMAND: `node ${path.join('node_modules', 'cucumber', 'bin', 'cucumber')}`,

    REQUEST_ERROR: 400,
    FILE_NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
};

export default CONSTANTS;
