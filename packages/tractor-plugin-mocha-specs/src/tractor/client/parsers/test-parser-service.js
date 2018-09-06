// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Queries:
const ONLY_QUERY = 'ExpressionStatement > CallExpression > MemberExpression > Identifier[name="only"]';
const SKIP_QUERY = 'ExpressionStatement > CallExpression > MemberExpression > Identifier[name="skip"]';
const STEP_QUERY = 'FunctionExpression > BlockStatement > ExpressionStatement[expression.left.name="step"]';

// Dependencies:
import esquery from 'esquery';
import '../models/test';
import './step-parser-service';

function TestParserService (
    TestModel,
    astCompareService,
    stepParserService
) {
    return { parse };

    function parse (spec, astObject, meta) {
        let test = new TestModel(spec);

        if (meta && meta.name) {
            test.name = meta.name;
        }

        let [only] = esquery(astObject, ONLY_QUERY);
        test.only = !!only;
        let [skip] = esquery(astObject, SKIP_QUERY);
        test.skip = !!skip;
        if (test.skip) {
            test.reason = meta.reason;
        }

        let steps = esquery(astObject, STEP_QUERY);
        steps.forEach(stepASTObject => {
            let step = stepParserService.parse(test, stepASTObject);
            test.steps.push(step);
        });

        let parsedCorrectly = astCompareService.compare(astObject, test.ast);
        if (!parsedCorrectly) {
            test.isUnparseable = astObject;
        }

        return test;
    }
}

MochaSpecsModule.service('testParserService', TestParserService);
