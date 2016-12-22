// Constants:
import CONSTANTS from '../constants';

// Utilities:
import _ from 'lodash';
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
        return super.read()
        .then(content => {
            setTokens.call(this, content);
            return content;
        })
        .catch(error => {
            console.error(error);
            throw new TractorError(`Lexing "${this.path}" failed.`, CONSTANTS.REQUEST_ERROR);
        });
    }

    move (update, options) {
        return super.move(update, options)
        .then(newFile => {
            let { oldPath, newPath } = update;
            if (oldPath && newPath) {
                let oldName = path.basename(oldPath, this.extension);
                let newName = path.basename(newPath, this.extension);
                console.log(oldName, newName, oldPath, newPath);
                return refactorName.call(newFile, oldName, newName);
            }
        });
    }

    save (data) {
        return super.save(data)
        .then(content => {
            setTokens.call(this, content);
            let generator = new StepDefinitionGenerator(this);
            return generator.generate()
            .then(() => content)
        })
        .catch(error => {
            console.error(error);
            throw new TractorError(`Generating step definitions from "${this.path}" failed.`, CONSTANTS.REQUEST_ERROR);
        });
    }

    serialise () {
        let serialised = super.serialise();
        serialised.tokens = this.tokens;
        return serialised;
    }
}

function refactorName (oldName, newName) {
    let escapedOldName = _.escapeRegExp(oldName);
    let oldNameRegExp = new RegExp(`(Feature:\\s)${escapedOldName}(\\r\\n|\\n)`);

    return this.save(this.content.replace(oldNameRegExp, `$1${newName}$2`));
}

function setTokens (content) {
    let formatter = new FeatureLexerFormatter();
    let EnLexer = gherkin.Lexer('en');
    let enLexer = new EnLexer(formatter);
    enLexer.scan(content);
    this.tokens = formatter.done();
}

FeatureFile.prototype.extension = '.feature';
FeatureFile.prototype.type = 'features';

tractorFileStructure.registerFileType(FeatureFile);
