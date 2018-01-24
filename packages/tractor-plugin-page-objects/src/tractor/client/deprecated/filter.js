// Module:
import { PageObjectsModule } from '../page-objects.module';

function createDeprecatedFilterModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    let ast = astCreatorService;

    let DeprecatedFilterModel = function DeprecatedFilterModel (element) {
        Object.defineProperties(this, {
            element: {
                get () {
                    return element;
                }
            },
            isGroup: {
                get () {
                    return this.selector === 'options' || this.selector === 'repeater';
                }
            },
            isText: {
                get () {
                    return this.selector === 'text';
                }
            },
            ast: {
                get () {
                    return this.unparseable || toAST.call(this);
                }
            }
        });

        [this.selector] = this.selectors;
        this.locator = '';
    };

    // TODO: I don't like that the user has to know to use
    // 'buttonText' or 'linkText'. We should infer it from
    // the CSS selector.
    DeprecatedFilterModel.prototype.selectors = ['model', 'binding', 'css', 'text', 'options', 'repeater', 'buttonText', 'linkText'];

    return DeprecatedFilterModel;

    function toAST () {
        if (this.isNested) {
            return toNestedAST.call(this);
        } else {
            return toSingleAST.call(this);
        }
    }

    function toNestedAST () {
        let locatorLiteral = ast.literal(this.locator);
        let template = '';

        let number = stringToLiteralService.toLiteral(locatorLiteral.value);
        if (typeof number === 'number') {
            return ast.literal(number);
        } else {
            template += '(function (element) {';
            template += '    return element.getText().then(function (text) {';
            template += '        return text.indexOf(<%= locator %>) !== -1;';
            template += '    });';
            template += '});';
            return ast.expression(template, {
                locator: locatorLiteral
            });
        }
    }

    function toSingleAST () {
        let template = '';

        if (!this.isText) {
            let locatorLiteral = ast.literal(this.locator);
            template += 'by.<%= selector %>(<%= locator %>)';
            return ast.expression(template, {
                selector: ast.identifier(this.selector),
                locator: locatorLiteral
            });
        } else {
            // TODO: The comma-separated thing is weird here,
            // it makes the code a bit yuck. Can we just have
            // an extra input?
            let locator = this.locator.split(',');
            let cssLiteral = ast.literal(locator[0].trim());
            let searchStringLiteral = ast.literal(locator[1].trim());
            template += 'by.cssContainingText(<%= cssSelector %>,<%= searchString %>)';
            return ast.expression(template, {
                cssSelector: cssLiteral,
                searchString: searchStringLiteral
            });
        }
    }
}

PageObjectsModule.factory('DeprecatedFilterModel', createDeprecatedFilterModelConstructor);
