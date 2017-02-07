export const fileExtensions = {};
export const fileTypes = {};

export function registerFileType (fileConstructor) {
    fileExtensions[fileConstructor.prototype.type] = fileConstructor.prototype.extension;
    fileTypes[fileConstructor.prototype.extension] = fileConstructor;
}
