// Dependencies:
import { getConfig } from 'tractor-config-loader';
import FileStructure from './structure/FileStructure';

let { testDirectory } = getConfig();
export let fileStructure = new FileStructure(testDirectory);
