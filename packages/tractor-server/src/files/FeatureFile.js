// Constants:
const REQUEST_ERROR = 400;

// Utilities:
import escapeRegExp from 'lodash.escaperegexp';
import path from 'path';

// Dependencies:
import FeatureLexerFormatter from './utils/FeatureLexerFormatter';
import gherkin from 'gherkin';
import StepDefinitionGenerator from './utils/StepDefinitionGenerator';
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export default class FeatureFile extends File {
    read () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let read = super.read();

        return read.then(content => {
            setTokens(this, content);
            return content;
        })
        .catch(() => {
            throw new TractorError(`Lexing "${this.path}" failed.`, REQUEST_ERROR);
        });
    }

    move (update, options) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let move = super.move(update, options);

        return move.then(newFile => {
            let { oldPath, newPath } = update;
            if (oldPath && newPath) {
                let oldName = path.basename(oldPath, this.extension);
                let newName = path.basename(newPath, this.extension);

                return refactorName(newFile, oldName, newName);
            }
        });
    }

    save (data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let save = super.save(data);

        return save.then(content => {
            setTokens(this, content);
            let generator = new StepDefinitionGenerator(this);
            return generator.generate()
            .then(() => content)
        })
        .catch(() => {
            throw new TractorError(`Generating step definitions from "${this.path}" failed.`, REQUEST_ERROR);
        });
    }

    serialise () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let serialised = super.serialise();

        serialised.tokens = this.tokens;
        return serialised;
    }
}

function refactorName (newFile, oldName, newName) {
    let escapedOldName = escapeRegExp(oldName);
    let oldNameRegExp = new RegExp(`(Feature:\\s)${escapedOldName}(\\r\\n|\\n)`);

    return newFile.save(newFile.content.replace(oldNameRegExp, `$1${newName}$2`));
}

function setTokens (file, content) {
    let formatter = new FeatureLexerFormatter();
    let EnLexer = gherkin.Lexer('en');
    let enLexer = new EnLexer(formatter);
    enLexer.scan(content);
    file.tokens = formatter.done();
}

FeatureFile.prototype.extension = '.feature';
FeatureFile.prototype.type = 'features';

tractorFileStructure.registerFileType(FeatureFile);
