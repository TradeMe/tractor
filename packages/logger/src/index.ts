// Dependencies:
import { addLevel, enableColor, enableUnicode, log, StyleObject } from 'npmlog';

// HACK:
// Need to import npmlog as a module to override global settings.
// tslint:disable-next-line:no-duplicate-imports
import * as npmlog from 'npmlog';

// HACK:
// The lint rule is broken, this assertion is necessary to overwriting "readonly".
// tslint:disable:no-unnecessary-type-assertion
(npmlog.heading as string) = '🚜  tractor';
(npmlog.headingStyle as StyleObject) = {
    bg: 'black',
    fg: 'green'
};
// tslint:enable:no-unnecessary-type-assertion

enableColor();
enableUnicode();

export function mute (): void {
    // HACK:
    // The lint rule is broken, this assertion is necessary to overwriting "readonly".
    // tslint:disable:no-unnecessary-type-assertion
    (npmlog.level as string) = 'silent';
}

const INFO_LEVEL = 2000;
const INFO_STYLE: StyleObject = {
    fg: 'blue'
};
export const info = createLogger('info', INFO_LEVEL, INFO_STYLE);

const WARN_LEVEL = 3000;
const WARN_STYLE: StyleObject = {
    fg: 'yellow'
};
export const warn = createLogger('warn', WARN_LEVEL, WARN_STYLE);

const ERROR_LEVEL = 4000;
const ERROR_STYLE: StyleObject = {
    fg: 'red'
};
export const error = createLogger('error', ERROR_LEVEL, ERROR_STYLE);

function createLogger (name: string, level: number, style: StyleObject): (...args: Array<string>) => void {
    const loggerName = `tractor-${name}`;
    addLevel(loggerName, level, style, name);
    return function (message: string, ...args: Array<string>): void {
        log(loggerName, '', message, ...args);
    };
}
