// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import { match, parse } from 'esquery';
import '../models/test';
import './step-parser-service';

// Queries:
const ONLY_QUERY = parse('ExpressionStatement > CallExpression > MemberExpression > Identifier[name="only"]');
const SKIP_QUERY = parse('ExpressionStatement > CallExpression > MemberExpression > Identifier[name="skip"]');
const STEP_QUERY = parse('FunctionExpression > BlockStatement > ExpressionStatement[expression.left.name="step"]');
const FLAKEY_QUERY = parse('FunctionExpression > BlockStatement > ExpressionStatement > CallExpression:has(MemberExpression[object.type="ThisExpression"][property.name="retries"])');

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

        let [only] = match(astObject, ONLY_QUERY);
        test.only = !!only;
        let [skip] = match(astObject, SKIP_QUERY);
        test.skip = !!skip;
        if (test.skip) {
            test.reason = meta.reason;
        }

        let [flakey] = match(astObject, FLAKEY_QUERY);
        test.flakey = !!flakey;

        let steps = match(astObject, STEP_QUERY);
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
