// Dependencies:
import { File } from '@tractor/file-structure';
import { Request, RequestHandler, Response } from 'express';
import { Search, StemmingTokenizer } from 'js-search';
import debounce = require('lodash.debounce');
import * as monkeypatch from 'monkeypatch';
import { stemmer } from 'porter-stemmer';
import { TractorSearchParams } from './search-params';

// Constants:
const INDEX_DEBOUNCE_TIME = 1000;
const SEARCH_RESULTS = 20;

// TODO: This could be rethought... It isn't a particularly elegant method of
// hooking into the file structure, but it is quite effective? It is proving
// quite tricky to test.
// FlexSearch (https://github.com/nextapps-de/flexsearch) may be the path
// forward?
export function searchHandler (): RequestHandler {
    const FILES: Array<File> = [];

    let search: Search;
    const indexFiles = debounce(() => search = createSearchIndex(FILES), INDEX_DEBOUNCE_TIME);

    monkeypatchFile('read', async function (original: File['read']): Promise<string> {
        const result = await original.apply(this);
        if (!FILES.includes(this)) {
            FILES.push(this);
        }
        indexFiles();
        return result;
    });

    monkeypatchFile('delete', async function (original: File['delete'], ...args: Parameters<File['delete']>): Promise<void> {
        await original.apply(this, args);
        FILES.splice(FILES.indexOf(this), 1);
        indexFiles();
        return;
    });

    monkeypatchFile('save', async function (original: File['save'], ...args: Parameters<File['save']>): Promise<string> {
        const result = await original.apply(this, args);
        if (!FILES.includes(this)) {
            FILES.push(this);
        }
        indexFiles();
        return result;
    });

    return function (request: Request, response: Response): void {
        const files: Array<File> = search ? search.search((request.query as TractorSearchParams).searchString) as Array<File> : [];
        const count = files.length;
        const metaData = files.splice(0, SEARCH_RESULTS).map(file => file.toJSON());
        response.send({ count, results: metaData });
    };
}

function createSearchIndex (files: Array<File>): Search {
    const search = new Search('path');
    search.tokenizer = new StemmingTokenizer(stemmer, search.tokenizer);
    search.addIndex('basename');
    search.addIndex('content');
    search.addDocuments(files);
    return search;
}

// TODO:
// Move these types to somewhere global maybe? 🌏
// tslint:disable-next-line:no-any
type AnyFunction = (...args: Array<any>) => any;
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends AnyFunction ? K : never }[keyof T];
function monkeypatchFile <FunctionName extends FunctionPropertyNames<File>> (name: FunctionName, patch: monkeypatch.MonkeypatchFunction<File, FunctionName>): void {
    if ((File.prototype[name] as monkeypatch.MonkeypatchedFunction<File[FunctionName]>).unpatch) {
        (File.prototype[name] as monkeypatch.MonkeypatchedFunction<File[FunctionName]>).unpatch();
    }

    monkeypatch(File.prototype, name, patch);
}
