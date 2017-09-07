declare var camelcase: CamelCase;
declare module 'camel-case' {
    export = camelcase;
}

interface CamelCase {
    (input: string): string;
}
