'use strict';

// Constants:
import constants from '../constants';

// Dependencies:
import ComponentFile from './ComponentFile';
import FeatureFile from './FeatureFile';
import MockDataFile from './MockDataFile';
import StepDefinitionFile from './StepDefinitionFile';

export default {
    [constants.COMPONENTS]: ComponentFile,
    [constants.FEATURES]: FeatureFile,
    [constants.MOCK_DATA]: MockDataFile,
    [constants.STEP_DEFINITIONS]: StepDefinitionFile
};
