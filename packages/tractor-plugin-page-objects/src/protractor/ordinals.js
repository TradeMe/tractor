const ORDINAL_REGEX = /^(\d+)(st|nd|rd|th)?$/;

export function parseOrdinal (str) {
    let [, ordinal] = str.match(ORDINAL_REGEX) || [];
    return +ordinal || null;
}
