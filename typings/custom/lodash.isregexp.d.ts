declare var isRegExp: IsRegExp;
declare module 'lodash.isregexp' {
    export = isRegExp;
}

interface IsRegExp {
    (regexp: any): boolean;
}
