// Dependencies:
import { info, warn } from '@tractor/logger';
import bodyParser from 'body-parser';
import cheerio from 'cheerio';
import express from 'express';
import proxy from 'express-http-proxy';
import fs from 'fs';
import getPort from 'get-port';
import http from 'http';
import path from 'path';
import zlib from 'zlib';

// Scripts:
const ADD_MOCKING = fs.readFileSync(path.resolve(__dirname, '../scripts/add-mocking.js'), 'utf8');
const INIT = fs.readFileSync(path.resolve(__dirname, '../scripts/init.js'), 'utf8');
const SHIM_FETCH = fs.readFileSync(path.resolve(__dirname, '../scripts/shim-fetch.js'), 'utf8');
const SHIM_XHR = fs.readFileSync(path.resolve(__dirname, '../scripts/shim-xhr.js'), 'utf8');
const MOCKS = [];

let server;
export async function serve (baseUrl, mockRequestsConfig) {
    // Another test run has started the server already:
    if (server) {
        return;
    }

    // Server not already running, so let's start it:
    const port = await getSafePort(mockRequestsConfig.minPort, mockRequestsConfig.maxPort);
    mockRequestsConfig.port = port;

    shimZlib();

    let application = express();

    let host = baseUrl;
    server = http.createServer(application);

    application.use(bodyParser.json());
    application.set('etag', false);

    application.use('/mock-requests/add-mock', addMock);

    application.use(proxy(host, {
        proxyReqOptDecorator: createRequestDecorator(host, mockRequestsConfig),
        userResDecorator: createResponseDecorator(host),
        proxyReqBodyDecorator: createRequestBodyDecorator()
    }));

    return new Promise(resolve => {
        server.listen(port, () => {
            info(`@tractor-plugins/mock-requests is proxying at port ${port}`);
            resolve();
        });
    });
}

export function close () {
    return new Promise(resolve => {
        server.close(() => resolve());
    });
}

function addMock (request, response) {
    MOCKS.push(request.body.mock);
    response.send();
}

function createRequestDecorator (host, mockRequestsConfig) {
    let { headers } = mockRequestsConfig;
    return function (requestOptions) {
        Object.keys(headers).forEach(header => {
            if (!requestOptions.headers[header]) {
                requestOptions.headers[header] = headers[header];
            }
        });
        clearRequestCacheHeaders(requestOptions);
        requestOptions.headers['Referer'] = host;
        requestOptions.rejectUnauthorized = false;
        return requestOptions;
    };
}


function createResponseDecorator (host) {
    return function (proxyResponse, data, request, response) {
        let result = data;
        let status = `${proxyResponse.statusCode}`;
        if (isHTML(proxyResponse) && status.startsWith(2)) {
            clearResponseCacheHeaders(response);

            let $ = cheerio.load(data.toString());
            let $head = $('head');
            if ($head.length) {
                $head.prepend(`
                    <script>
                        ${INIT}
                        ${SHIM_FETCH}
                        ${SHIM_XHR}
                        ${ADD_MOCKING}
                        ${MOCKS.join('\n\n')}
                        window.__tractor__.baseUrl = '${host}';
                    </script>
                `);
                MOCKS.length = 0;

                result = $.html();
            }
        }
        return result;
    };
}

function createRequestBodyDecorator () { 
    return function (body) {
        // Get requests are being sent with a body of an empty object 
        // This causes GCP load balancer to throw a 400 error
        // In this situation replace with an empty string
        const bodyIsEmptyObject = typeof body === 'object' && Object.keys(body).length === 0;
        if (bodyIsEmptyObject) {
            return '';
        }
    };
}

function clearRequestCacheHeaders (request) {
    delete request.headers['if-modified-since'];
}

function clearResponseCacheHeaders (response) {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');
    response.removeHeader('last-modified');
}

function isHTML (response) {
    let { headers } = response;
    let contentType = headers && headers['content-type'];
    return contentType && contentType.indexOf('text/html') !== -1;
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

async function getSafePort (minPort, maxPort, iterations = 1) {
    const port = await getPort({ port: getPort.makeRange(minPort, maxPort)});

    if (port >= minPort || port <= maxPort) {
        return port;
    } 
    
    if (iterations == 10) {
        warn(`Could not get port in range (${minPort}, ${maxPort}). Tried 10 times. Giving up. You are getting a random port.`);    
        return port;
    }
    warn(`Could not get port in range (${minPort}, ${maxPort}). Trying again...`);
    
    return await getSafePort(minPort, maxPort, iterations += 1);
}