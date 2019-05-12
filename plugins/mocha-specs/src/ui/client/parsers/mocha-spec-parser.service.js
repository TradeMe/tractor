// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import { match, parse } from 'esquery';
import '../models/mocha-spec';
import './test-parser-service';

// Queries:
const SUITE_QUERY = 'ExpressionStatement > CallExpression[callee.name="describe"]';
const FLAKEY_SUITE_QUERY = parse(`${SUITE_QUERY} > FunctionExpression > BlockStatement > ExpressionStatement> CallExpression > MemberExpression[object.type="ThisExpression"][property.name="retries"]`);
const SUITE_NAME_QUERY = parse(`${SUITE_QUERY} > Literal`);
const TEST_QUERY = parse(`${SUITE_QUERY} > FunctionExpression > BlockStatement > ExpressionStatement:has(Identifier[name="it"])`);

function MochaSpecParserService (
    MochaSpecModel,
    astCompareService,
    persistentStateService,
    plugins,
    testParserService
) {
    return { parse };

    function parse (mochaSpecFile, availablePageObjects, availableMockRequests) {
        let mochaSpec = new MochaSpecModel(mochaSpecFile);
        mochaSpec.name = mochaSpecFile.basename;

        let astObject = mochaSpecFile.ast;

        // If this is a brand new, empty .po.js file, the AST will be empty:
        const isNewFile = isEmptyAST(astObject);

        let meta;
        if (!isNewFile) {
            try {
                let [metaComment] = astObject.comments;
                meta = JSON.parse(metaComment.value);
            } catch (e) {
                // If we can't parse the meta comment, we just bail straight away:
                mochaSpec.isUnparseable = astObject;
                return mochaSpec;
            }
        }

        const tests = isNewFile ? [] : meta.tests;
        const name = isNewFile ? mochaSpec.name : meta.name;
        const version = isNewFile ? _getMochaSpecsVersion(plugins) : meta.version;

        mochaSpec.name = name;
        mochaSpec.version = version;
        mochaSpec.availablePageObjects = availablePageObjects;
        mochaSpec.availableMockRequests = availableMockRequests;

        let state = persistentStateService.get(mochaSpec.name);

        let [suiteName] = match(astObject, SUITE_NAME_QUERY);
        if (suiteName) {
            mochaSpec.suiteName = suiteName.value;
        }

        let [flakey] = match(astObject, FLAKEY_SUITE_QUERY);
        mochaSpec.flakey = !!flakey;

        match(astObject, TEST_QUERY).forEach(testASTObject => {
            let testMeta = tests[mochaSpec.tests.length];
            let test = testParserService.parse(mochaSpec, testASTObject, testMeta);
            const minimised = state[test.name];
            test.minimised = minimised == null ? true : !!minimised;
            mochaSpec.tests.push(test);
        });

        let parsedCorrectly = isNewFile || astCompareService.compare(astObject, mochaSpec.ast);
        if (!parsedCorrectly) {
            mochaSpec.isUnparseable = astObject;
            if (version !== mochaSpec.version) {
                mochaSpec.outdated = true;
            }
        }

        return mochaSpec;
    }

    function isEmptyAST (ast) {
        return ast.body.length === 0 && ast.comments.length === 0;
    }

    function _getMochaSpecsVersion (plugins) {
        return plugins.find(plugin => plugin.name === 'Mocha Specs').version;
    }
}

MochaSpecsModule.service('mochaSpecParserService', MochaSpecParserService);
