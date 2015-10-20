'use strict';

// Constants:
import constants from '../../constants';

// Utilities:
import _ from 'lodash';

// Dependencies:
import componentTransformer from './component-transformer';
import featureTransformer from './feature-transformer';
import mockDataTransformer from './mock-data-transformer';

export default {
    [constants.COMPONENTS]: componentTransformer,
    [constants.FEATURES]: featureTransformer,
    [constants.STEP_DEFINITIONS]: _.noop,
    [constants.MOCK_DATA]: mockDataTransformer
};
