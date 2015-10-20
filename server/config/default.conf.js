'use strict';

// Utilities:
import _ from 'lodash';

export default {
    testDirectory: './e2e-tests',
    port: 4000,
    environments: [
        'http://localhost:8080'
    ],
    beforeProtractor: _.noop,
    afterProtractor: _.noop
};
