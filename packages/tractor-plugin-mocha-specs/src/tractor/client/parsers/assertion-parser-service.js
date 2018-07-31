// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Queries:
const ASSERTION_ARGUMENT_QUERY = 'ReturnStatement > CallExpression > Literal';
const ASSERTION_CONDITION_QUERY = 'ReturnStatement > CallExpression > MemberExpression > Identifier';

// Dependencies:
import esquery from 'esquery';
import '../models/assertion';

function AssertionParserService (
    SpecAssertionModel,
) {
    return { parse };

    function parse (test, astObject) {
        let assertion = new SpecAssertionModel(test);
        _parseAssertion(assertion, astObject);
        return assertion;
    }


    function _parseAssertion (assertion, astObject) {
        let [argument] = esquery(astObject, ASSERTION_ARGUMENT_QUERY);
        assertion.expectedResult.value = argument && argument.value.toString();

        let [condition] = esquery(astObject, ASSERTION_CONDITION_QUERY);
        assertion.condition = condition && condition.name;
    }
}

MochaSpecsModule.service('assertionParserService', AssertionParserService);
