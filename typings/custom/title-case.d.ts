declare var titlecase: TitleCase;
declare module 'title-case' {
    export = titlecase;
}

interface TitleCase {
    (input: string): string;
}
