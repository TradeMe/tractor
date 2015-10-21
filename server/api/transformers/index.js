'use strict';

// Constants:
import constants from '../../constants';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import componentTransformer from './component-transformer';
import featureTransformer from './feature-transformer';
import mockDataTransformer from './mock-data-transformer';

export default {
    [constants.COMPONENTS]: componentTransformer,
    [constants.FEATURES]: featureTransformer,
    [constants.STEP_DEFINITIONS]: Promise.resolve,
    [constants.MOCK_DATA]: mockDataTransformer
};
