// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Queries:
const TEST_QUERY = 'ExpressionStatement > CallExpression[callee.name="describe"] > FunctionExpression > BlockStatement > ExpressionStatement';

// Dependencies:
import esquery from 'esquery';
import '../models/mocha-spec';
import './test-parser-service';

function MochaSpecParserService (
    MochaSpecModel,
    astCompareService,
    persistentStateService,
    testParserService
) {
    return { parse };

    function parse (mochaSpecFile, availablePageObjects, availableMockRequests) {
        let mochaSpec = new MochaSpecModel(mochaSpecFile);

        // Give the spec an initial name, in case parsing the metadata fails:
        mochaSpec.name = mochaSpecFile.basename;

        let astObject = mochaSpecFile.ast;

        let meta;
        try {
            let [metaComment] = astObject.comments;
            meta = JSON.parse(metaComment.value);
        } catch (e) {
            // If we can't parse the meta comment, we just bail straight away:
            mochaSpec.isUnparseable = astObject;
            return mochaSpec;
        }

        mochaSpec.name = meta.name;
        mochaSpec.version = meta.version;
        mochaSpec.availablePageObjects = availablePageObjects;
        mochaSpec.availableMockRequests = availableMockRequests;

        let state = persistentStateService.get(mochaSpec.name);

        let tests = esquery(astObject, TEST_QUERY);
        tests.forEach(testASTObject => {
            let testMeta = meta.tests[mochaSpec.tests.length];
            let test = testParserService.parse(mochaSpec, testASTObject, testMeta);
            test.minimised = !!state[test.name];
            mochaSpec.tests.push(test);
        });

        let parsedCorrectly = astCompareService.compare(astObject, mochaSpec.ast);
        if (!parsedCorrectly) {
            mochaSpec.isUnparseable = astObject;
            if (meta.version !== mochaSpec.version) {
                mochaSpec.outdated = true;
            }
        }

        return mochaSpec;
    }
}

MochaSpecsModule.service('mochaSpecParserService', MochaSpecParserService);
