declare var pascalcase: PascalCase;
declare module 'pascal-case' {
    export = pascalcase;
}

interface PascalCase {
    (input: string): string;
}
