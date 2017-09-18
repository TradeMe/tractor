// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/method-argument';

function MethodArgumentParserService (MethodArgumentModel) {
    return { parse };

    function parse (method, argument, astObject) {
        argument = new MethodArgumentModel(method, argument);
        argument.value = astObject.name || astObject.value;

        return argument;
    }
}

PageObjectsModule.service('methodArgumentParserService', MethodArgumentParserService);
