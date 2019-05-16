// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { ProtractorBrowser } from 'protractor';
import { Accessibility } from '../../protractor/accessibility/accessibility';
import { TractorAccessibilityConfigInternal } from '../../protractor/accessibility/accessibility-config';

export const create = inject((
    browser: ProtractorBrowser,
    config: TractorAccessibilityConfigInternal
): Accessibility => new Accessibility(browser, config), 'browser', 'config');
