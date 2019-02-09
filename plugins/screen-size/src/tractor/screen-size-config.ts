// Dependencies:
import { TractorConfig } from '@tractor/config-loader';
import { ISize } from 'selenium-webdriver';

export type ScreenSizeConfigInternal = Record<string, ISize | 'maximize'>;

export type TractorScreenSizeConfigInternal = {
    screenSizes: ScreenSizeConfigInternal;
};

export type ScreenSizeConfig = Record<string, string | number | Partial<ISize>>;

export type TractorScreenSizeConfig = TractorConfig & Partial<{
    screenSizes: ScreenSizeConfig;
}>;
