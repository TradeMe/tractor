// Constants:
const COMPONENTS = 'components';
const FEATURES = 'features';
const MOCK_DATA = 'mock-data';
const STEP_DEFINITIONS = 'step-definitions';

// Utilities:
import { join } from 'path';

const CONSTANTS = {
    COMPONENTS,
    FEATURES,
    MOCK_DATA,
    STEP_DEFINITIONS,

    DIRECTORIES: [COMPONENTS, FEATURES, MOCK_DATA, STEP_DEFINITIONS],
    EXTENSIONS: {
        [COMPONENTS]: '.component.js',
        [FEATURES]: '.feature',
        [MOCK_DATA]: '.mock.json',
        [STEP_DEFINITIONS]: '.step.js'
    },

    CUCUMBER_COMMAND: `node ${join('node_modules', 'cucumber', 'bin', 'cucumber')}`,

    FEATURE_NEWLINE: /\n/g,

    REQUEST_ERROR: 400,
    FILE_NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
};

export default CONSTANTS;
