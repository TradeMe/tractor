'use strict';

// Constants:
import constants from '../constants';

// Utilities:
import _ from 'lodash';

export default {
    testDirectory: './e2e-tests',
    port: constants.DEFAULT_PORT,
    environments: [
        'http://localhost:8080'
    ],
    beforeProtractor: _.noop,
    afterProtractor: _.noop
};
