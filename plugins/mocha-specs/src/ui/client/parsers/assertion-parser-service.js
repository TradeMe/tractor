// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import { match, parse } from 'esquery';
import '../models/assertion';

// Queries:
const ASSERTION_ARGUMENT_QUERY = parse('ReturnStatement > CallExpression > Literal');
const ASSERTION_CONDITION_QUERY = parse('ReturnStatement > CallExpression > MemberExpression > Identifier');

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
        let [argument] = match(astObject, ASSERTION_ARGUMENT_QUERY);
        assertion.expectedResult.value = argument && argument.value != null ? argument.value.toString() : null;

        let [condition] = match(astObject, ASSERTION_CONDITION_QUERY);
        assertion.condition = condition && condition.name;
    }
}

MochaSpecsModule.service('assertionParserService', AssertionParserService);
