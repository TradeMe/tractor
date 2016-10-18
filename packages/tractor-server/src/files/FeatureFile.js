// Constants:
import CONSTANTS from '../constants';

// Utilities:
import os from 'os';

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

    save (feature) {
        feature = feature.replace(CONSTANTS.FEATURE_NEWLINE, os.EOL);
        return super.save(feature)
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

function setTokens (content) {
    let formatter = new FeatureLexerFormatter();
    let EnLexer = gherkin.Lexer('en');
    let enLexer = new EnLexer(formatter);
    enLexer.scan(content);
    this.tokens = formatter.done();
}

FeatureFile.extension = '.feature';
FeatureFile.type = 'features';

tractorFileStructure.registerFileType(FeatureFile);
