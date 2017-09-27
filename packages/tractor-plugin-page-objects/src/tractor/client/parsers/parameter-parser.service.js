// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/parameter';

function ParameterParserService (ParameterModel) {
    return { parse };

    function parse (action) {
       return new ParameterModel(action);
    }
}

PageObjectsModule.service('parameterParserService', ParameterParserService);
