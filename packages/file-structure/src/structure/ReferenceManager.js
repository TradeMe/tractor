export class ReferenceManager {
    constructor (fileStructure) {
        this.fileStructure = fileStructure;
        this.references = { };
        this.referencedBy = { };
        this.fileStructures = [];
    }

    addFileStructure (fileStructure) {
        if (!this.fileStructures.includes(fileStructure)) {
            this.fileStructures.push(fileStructure);
            fileStructure.referenceManager.addFileStructure(this.fileStructure);
        }
    }

    getFileStructures () {
        return [this.fileStructure].concat(this.fileStructures);
    }

    addReference (from, to) {
        this.references[from.path] = this.references[from.path] || [];
        let references = this.references[from.path];
        if (!references.includes(to) && !hasFileByPath(references, to.path)) {
            references.push(to);
        }

        this.referencedBy[to.path] = this.referencedBy[to.path] || [];
        let referencedBy = this.referencedBy[to.path];
        if (!referencedBy.includes(from) && !hasFileByPath(referencedBy, from.path)) {
            referencedBy.push(from);
        }
    }

    getReference (path) {
        let fileStructure = this.getFileStructures()
        .find(fileStructure => {
            return fileStructure.allFilesByPath[path];
        });
        return fileStructure ? fileStructure.allFilesByPath[path] : null;
    }

    getReferences (path) {
        let references = [];
        this.getFileStructures()
        .forEach(fileStructure => {
            references = references.concat(fileStructure.referenceManager.references[path] || []);
        });
        return references;
    }

    getReferencedBy (path) {
        let referencedBy = [];
        this.getFileStructures()
        .forEach(fileStructure => {
            referencedBy = referencedBy.concat(fileStructure.referenceManager.referencedBy[path] || []);
        });
        return referencedBy;
    }

    clearReferences (path) {
        this.getFileStructures()
        .forEach(fileStructure => {
            let { references, referencedBy } = fileStructure.referenceManager;
            references[path] = [];
            removeFileByPath(referencedBy, path);
        });
    }

    clearReferencedBy (path) {
        this.getFileStructures()
        .forEach(fileStructure => {
            let { references, referencedBy } = fileStructure.referenceManager;
            referencedBy[path] = [];
            removeFileByPath(references, path);
        });
    }
}

function hasFileByPath (references, path) {
    return !!references.find(file => file.path === path);
}

function removeFileByPath (references, path) {
    Object.keys(references).forEach(referencePath => {
        let index = references[referencePath].findIndex(reference => reference.path === path);
        if (index >= 0) {
            references[referencePath].splice(index, 1);
        }
    });
}
