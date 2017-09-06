export class References {
    constructor (fileStructure) {
        this.fileStructure = fileStructure;
        this.referencesTo = { };
        this.referencesFrom = { };
        this.fileStructures = [];
    }

    addFileStructure (fileStructure) {
        if (!this.fileStructures.includes(fileStructure)) {
            this.fileStructures.push(fileStructure);
            fileStructure.references.addFileStructure(this.fileStructure);
        }
    }

    getFileStructures () {
        return [this.fileStructure].concat(this.fileStructures);
    }

    getFileStructureReferences () {
        return this.getFileStructures()
        .map(fileStructure => fileStructure.references);
    }

    addReference (to, from) {
        this.referencesTo[to.path] = this.referencesTo[to.path] || [];
        this.referencesTo[to.path].push(from);

        this.referencesFrom[from.path] = this.referencesFrom[from.path] || [];
        this.referencesFrom[from.path].push(to);
    }

    getReference (path) {
        let fileStructure = this.getFileStructures()
        .find(fileStructure => {
            return fileStructure.allFilesByPath[path];
        });
        return fileStructure ? fileStructure.allFilesByPath[path] : null;
    }

    getReferencesTo (path) {
        let referencesTo = [];
        this.getFileStructureReferences()
        .forEach(references => {
            referencesTo = referencesTo.concat(references.referencesTo[path] || []);
        });
        return referencesTo;
    }

    getReferencesFrom (path) {
        let referencesFrom = [];
        this.getFileStructureReferences()
        .forEach(references => {
            referencesFrom = referencesFrom.concat(references.referencesFrom[path] || []);
        });
        return referencesFrom;
    }

    clearReferences (path) {
        this.clearReferencesTo(path);
        this.clearReferencesFrom(path);
    }

    clearReferencesTo (path) {
        this.getFileStructureReferences()
        .forEach(({ referencesTo, referencesFrom }) => {
            referencesTo[path] = [];
            Object.keys(referencesFrom).forEach(referencePath => {
                let references = referencesFrom[referencePath];
                let index = references.findIndex(reference => reference.path === path);
                if (index >= 0) {
                    references.splice(index, 1);
                }
            });
        });
    }

    clearReferencesFrom (path) {
        this.getFileStructureReferences()
        .forEach(({ referencesTo, referencesFrom }) => {
            referencesFrom[path] = [];
            Object.keys(referencesTo).forEach(referencePath => {
                let references = referencesTo[referencePath];
                let index = references.findIndex(reference => reference.path === path);
                if (index >= 0) {
                    references.splice(index, 1);
                }
            });
        });
    }
}
