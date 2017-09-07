declare var dedent: Dedent;
declare module 'dedent' {
    export = dedent;
}

interface Dedent {
    (template: string): string;
}
