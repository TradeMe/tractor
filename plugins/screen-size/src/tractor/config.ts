// Dependencies:
import { ISize } from 'selenium-webdriver';
import { TractorScreenSizeConfig, TractorScreenSizeConfigInternal } from '../protractor/screen-size/screen-size-config';

// Constants:
import { DEFAULT, MAXIMIZE } from '../protractor/screen-size/screen-size';
const DEFAULT_HEIGHT = 1000;

export function config (tractorConfig: TractorScreenSizeConfig): TractorScreenSizeConfigInternal {
    tractorConfig.screenSizes = tractorConfig.screenSizes || {};
    const { screenSizes } = tractorConfig;
    Object.keys(screenSizes).forEach(key => {
        const sizeConfig = screenSizes[key];

        // Handle special "maximize" case:
        // {
        //    sm: 'maximize'
        // }
        if (sizeConfig === MAXIMIZE) {
            return;
        }

        // Handle special "default" case:
        // {
        //    sm: 480,
        //    default: 'sm'
        // }
        const alias = screenSizes[sizeConfig as string];
        if (key === DEFAULT && alias) {
            screenSizes[key] = alias;
            return;
        }

        // Handle getting just "width" as a number:
        // {
        //    sm: 480
        // }
        let sizeDimensions = sizeConfig as Partial<ISize>;
        if (typeof sizeConfig === 'number') {
            sizeDimensions = { width: sizeConfig };
        }

        // Handle getting just "width" as an object:
        // {
        //    sm: { width: 480 }
        // }
        if (!sizeDimensions.height) {
            sizeDimensions.height = DEFAULT_HEIGHT;
        }
        screenSizes[key] = sizeDimensions as ISize;
    });
    screenSizes.default = screenSizes.default || MAXIMIZE;
    return tractorConfig as TractorScreenSizeConfigInternal;
}
