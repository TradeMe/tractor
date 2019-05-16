// Dependencies:
import { TractorConfig } from '@tractor/config-loader';

export type AccessibilityConfigInternal = {
    reportsDirectory: string;
};

export type TractorAccessibilityConfigInternal = {
    accessibility: AccessibilityConfigInternal;
};

export type TractorAccessibilityConfig = TractorConfig & Partial<{
    accessibility: Partial<AccessibilityConfigInternal>;
}>;
