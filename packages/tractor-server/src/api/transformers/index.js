// Constants:
import CONSTANTS from '../../constants';

// Dependencies:
import componentTransformer from './component-transformer';
import featureTransformer from './feature-transformer';
import mockDataTransformer from './mock-data-transformer';
import stepDefinitionTransformer from './step-definition-transformer';

export default {
    [CONSTANTS.COMPONENTS]: componentTransformer,
    [CONSTANTS.FEATURES]: featureTransformer,
    [CONSTANTS.STEP_DEFINITIONS]: stepDefinitionTransformer,
    [CONSTANTS.MOCK_DATA]: mockDataTransformer
};
