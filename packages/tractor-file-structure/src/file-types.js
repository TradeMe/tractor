let fileExtensions = { };
let fileTypes = { };

export const extensions = fileExtensions;
export const types = fileTypes;

export function registerFileType (fileConstructor) {
    fileExtensions[fileConstructor.prototype.type] = fileConstructor.prototype.extension;
    fileTypes[fileConstructor.prototype.extension] = fileConstructor;
}
