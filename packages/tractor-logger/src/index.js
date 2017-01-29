// Constants:
const PREFIX = '';
const HEADING = '🚜  tractor';

import npmlog from 'npmlog';
let { style } = npmlog;

npmlog.heading = HEADING;
npmlog.headingStyle = {
    fg: 'green',
    bg: 'black'
};
npmlog.enableUnicode();

style.info = {
    fg: 'blue'
};
export function info (...args) {
    npmlog.info(PREFIX, ...args);
}

style.warn = {
    fg: 'yellow'
};
export function warn (...args) {
    npmlog.warn(PREFIX, ...args);
}

style.error = {
    fg: 'red'
};
export function error (...args) {
    npmlog.error(PREFIX, ...args);
}
