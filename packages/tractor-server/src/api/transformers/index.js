'use strict';

// Constants:
import constants from '../../constants';

// Dependencies:
import componentTransformer from './component-transformer';
import featureTransformer from './feature-transformer';
import mockDataTransformer from './mock-data-transformer';
import stepDefinitionTransformer from './step-definition-transformer';

export default {
    [constants.COMPONENTS]: componentTransformer,
    [constants.FEATURES]: featureTransformer,
    [constants.STEP_DEFINITIONS]: stepDefinitionTransformer,
    [constants.MOCK_DATA]: mockDataTransformer
};
