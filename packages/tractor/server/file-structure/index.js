'use strict';

// Dependencies:
import FileStructure from './FileStructure';

let fileStructure = new FileStructure();

export default fileStructure;

export function refresh () {
    fileStructure.init();
    return fileStructure.read();
}
