// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/argument';

function ArgumentParserService (ArgumentModel) {
    return { parse };

    function parse (method, argument, astObject) {
        argument = new ArgumentModel(method, argument);
        argument.value = astObject.name || astObject.value;

        return argument;
    }
}

PageObjectsModule.service('argumentParserService', ArgumentParserService);
