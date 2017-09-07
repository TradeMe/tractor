// Utilities:
import fs from 'fs';
import path from 'path';
import { getConfig } from './utilities';
import { info } from 'tractor-logger';

// Dependencies:
import bodyParser from 'body-parser';
import cheerio from 'cheerio';
import express from 'express';
import proxy from 'express-http-proxy';
import http from 'http';
import zlib from 'zlib';
import { FileStructure, serveFileStructure } from 'tractor-file-structure';
import { MockRequestFile } from './mock-request-file';

// Scripts:
const ADD_MOCKING = fs.readFileSync(path.resolve(__dirname, './scripts/add-mocking.js'), 'utf8');
const INIT = fs.readFileSync(path.resolve(__dirname, './scripts/init.js'), 'utf8');
const SHIM_FETCH = fs.readFileSync(path.resolve(__dirname, './scripts/shim-fetch.js'), 'utf8');
const SHIM_XHR = fs.readFileSync(path.resolve(__dirname, './scripts/shim-xhr.js'), 'utf8');
const MOCKS = [];

export default function serve (di, config) {
    shimZlib();

    config = getConfig(config);

    let application = express();

    let server = http.createServer(application);

    application.use(bodyParser.json());
    application.set('etag', false);

    application.use('/mock-requests/add-mock', addMock);
    application.use('/mock-requests/set-host', setHost);

    application.use(proxy(getProxyUrl, {
        proxyReqOptDecorator: createRequestDecorator(config),
        userResDecorator,
        memoizeHost: false
    }));

    let { directory, port } = config;

    let mockRequests = path.resolve(process.cwd(), directory);
    let mockRequestsFileStructure = new FileStructure(mockRequests);
    mockRequestsFileStructure.addFileType(MockRequestFile);
    di.constant({ mockRequestsFileStructure });

    di.call(serveFileStructure)(mockRequestsFileStructure, 'mock-requests');

    server.listen(port, () => {
        info(`tractor-mock-requests is proxying at port ${port}`);
    });
}
serve['@Inject'] = ['di', 'config'];

function addMock (request, response) {
    MOCKS.push(request.body.mock);
    response.send();
}

let host;
function getProxyUrl () {
    return host;
}

function createRequestDecorator (config) {
    let headers = config.headers || {};
    return function (requestOptions) {
        Object.keys(headers).forEach(header => {
            if (!requestOptions.headers[header]) {
                requestOptions.headers[header] = headers[header];
            }
        });
        requestOptions.headers['Referer'] = host;
        requestOptions.rejectUnauthorized = false;
        return requestOptions;
    };
}

function userResDecorator (proxyResponse, data) {
    let result = data;
    if (isHTML(proxyResponse)) {
        let $ = cheerio.load(data.toString());
        if ($('head').length) {
            $('head').prepend(`
                <script>
                    ${INIT}
                    ${SHIM_FETCH}
                    ${SHIM_XHR}
                    ${ADD_MOCKING}
                    ${MOCKS.join('\n\n')}
                </script>
            `);
            MOCKS.length = 0;

            result = $.html();
        }
    }
    return result;
}

function isHTML (response) {
    let { headers } = response;
    let contentType = headers && headers['content-type'];
    return contentType && contentType.indexOf('text/html') !== -1;
}

function setHost (request, response) {
    host = request.body.host;
    response.send();
}

// Temporarily adding this until GZIP issues are resolved:
// https://github.com/villadora/express-http-proxy/issues/177
/* istanbul ignore next */
function shimZlib () {
    let originalGzip = zlib.gzipSync;
    let originalGunzip = zlib.gunzipSync;
    zlib.gzipSync = function (data, options = {}) {
        options.finishFlush = zlib.Z_SYNC_FLUSH;
        return originalGzip.call(zlib, data, options);
    };
    zlib.gunzipSync = function (data, options = {}) {
        options.finishFlush = zlib.Z_SYNC_FLUSH;
        return originalGunzip.call(zlib, data, options);
    };
}
