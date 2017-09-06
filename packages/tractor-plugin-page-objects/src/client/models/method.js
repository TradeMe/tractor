// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import './argument';

function createMethodModelConstructor (
    ArgumentModel
) {
    let MethodModel = function MethodModel (interaction, method) {
        this.arguments = getArguments.call(this, method);

        Object.defineProperties(this, {
            interaction: {
                get () {
                    return interaction;
                }
            },
            name: {
                get () {
                    return method.name;
                }
            },
            description: {
                get () {
                    return method.description;
                }
            },
            returns: {
                get () {
                    return method.returns;
                }
            }
        });

        if (this.returns) {
            this[this.returns] = method[this.returns];
        }
    };

    return MethodModel;

    function getArguments (method) {
        let args = method.arguments || [];
        return args.map(argument => new ArgumentModel(this, argument));
    }
}

PageObjectsModule.factory('MethodModel', createMethodModelConstructor);
