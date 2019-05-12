// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Constants:
const MOCK_REQUEST_ACTION_REGEX = /when(.*)/;

// Dependencies:
import { match, parse } from 'esquery';
import '../models/mock-request';
import './header-parser-service';

// Queries:
const MOCK_REQUEST_ACTION_QUERY = parse('CallExpression > MemberExpression > Identifier[name=/^when/]');
const MOCK_REQUEST_PASSTHROUGH_QUERY = parse('Property[key.name="passThrough"] > Literal');
const MOCK_REQUEST_DATA_QUERY = parse('Property[key.name="body"] > Identifier[name!="body"]');
const MOCK_REQUEST_STATUS_QUERY = parse('Property[key.name="status"] > Literal');
const MOCK_REQUEST_HEADERS_QUERY = parse('Property[key.name="headers"] > ObjectExpression > Property');

function MockRequestParserService (
    SpecMockRequestModel,
    headerParserService
) {
    return { parse };

    function parse (test, astObject) {
        let mockRequest = new SpecMockRequestModel(test);
        _parseMockRequest(mockRequest, astObject);
        return mockRequest;
    }

    function _parseMockRequest (mockRequest, astObject) {
        let [action] = match(astObject, MOCK_REQUEST_ACTION_QUERY);
        if (action) {
            [, mockRequest.action] = action.name.match(MOCK_REQUEST_ACTION_REGEX);
        }

        let [url, options] = astObject.arguments;
        if (url && options) {
            // We escape parts of the RegExp when we save it, so we need to un-escape
            // it before it goes back into the UI:
            mockRequest.url = url.regex.pattern.replace(/\\\?/g, '?');

            let [passThrough] = match(options, MOCK_REQUEST_PASSTHROUGH_QUERY);
            if (passThrough) {
                mockRequest.passThrough = passThrough.value;
                return;
            }
    
            let [data] = match(options, MOCK_REQUEST_DATA_QUERY);
            if (data) {
                mockRequest.data = mockRequest.test.spec.availableMockRequests.find(mockRequest => mockRequest.variableName === data.name);
            }
    
            let [status] = match(options, MOCK_REQUEST_STATUS_QUERY);
            if (status) {
                mockRequest.status = status.value;
            }
    
            let headers = match(options, MOCK_REQUEST_HEADERS_QUERY);
            headers.forEach(headerASTObject => {
                let header = headerParserService.parse(mockRequest, headerASTObject);
                mockRequest.headers.push(header);
            });
        }
    }
}

MochaSpecsModule.service('mockRequestParserService', MockRequestParserService);
