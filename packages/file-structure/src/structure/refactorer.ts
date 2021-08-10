// tslint:disable-next-line: no-any no-unsafe-any
export type RefactorData = any;
export type Refactor<FileType> = (file: FileType, data: RefactorData) => Promise<void | null>;
export type Refactorer<FileType> = Record<string, Refactor<FileType>>;
