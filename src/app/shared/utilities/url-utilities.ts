'use strict';

// Constants:
const CLIENT_PATH_HEIRARCHY_CHARACTER = '>';
const SERVER_PATH_HEIRARCHY_CHARACTER = '/';

export function serverToClientFilePath (path: string) {
    let replace = new RegExp(SERVER_PATH_HEIRARCHY_CHARACTER, 'g');
    return path.replace(replace, CLIENT_PATH_HEIRARCHY_CHARACTER).replace(/\s/g, '+');
}

export function clientToServerFilePath (path: string) {
    let decoded = path.replace(/\+/g, ' ');
    let replace = new RegExp(CLIENT_PATH_HEIRARCHY_CHARACTER, 'g');
    return decoded.replace(replace, SERVER_PATH_HEIRARCHY_CHARACTER);
}
