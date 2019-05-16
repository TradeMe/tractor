// Constants:
const DEFAULT_REPORT_DIRECTORY = './tractor/reports';
import { TractorAccessibilityConfig, TractorAccessibilityConfigInternal } from '../protractor/accessibility/accessibility-config';

export function config (tractorConfig: TractorAccessibilityConfig): TractorAccessibilityConfigInternal {
    tractorConfig.accessibility = tractorConfig.accessibility || {};
    const { accessibility } = tractorConfig;
    accessibility.reportsDirectory = accessibility.reportsDirectory || DEFAULT_REPORT_DIRECTORY;
    return accessibility as TractorAccessibilityConfigInternal;
}
