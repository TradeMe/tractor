// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import '../models/header';

function HeaderParserService (
    HeaderModel,
) {
    return { parse };

    function parse (mock, astObject) {
        let header = new HeaderModel(mock);
        _parseHeader(header, astObject);

        // TODO: Should probably figure out a better way to do the header object AST creation.
        // We need to:
        //   1) Return an AST Property object from `_toAST` instead of a string.
        //   2) Use those Property objects to construct the full "headers" object.
        //
        // Then we can parse it properly, and do a real "isUnparseable" check here.

        return header;
    }


    function _parseHeader (header, astObject) {
        let { key, value } = astObject;
        if (key) {
            header.key = key.value || '';
        }

        if (value) {
            header.value = value.value || '';
        }
    }
}

MochaSpecsModule.service('headerParserService', HeaderParserService);
