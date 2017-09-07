'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Factory } from '../../../shared/factory/factory.interface';
import { Interaction } from '../interaction/interaction';
import { Method } from '../method/method';
import { Parameter } from '../parameter/parameter';
import { StringToLiteralService } from '../../../shared/string-to-literal/string-to-literal.service';

@Injectable()
export class ArgumentFactory implements Factory<Argument> {
    constructor (
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public create (method: Method, argument): Argument {
        let instance = new Argument(this.astService, this.stringToLiteralService);
        instance.init(method, argument);
        return instance;
    }
}

export class Argument {
    private _argument;
    private _method: Method;

    public value: string = '';

    public get method (): Method {
        return this._method || null;
    }

    public get name (): string {
        return this._argument ? this._argument.name : null;
    }

    public get description (): string {
        return this._argument ? this._argument.description : null;
    }

    public get type (): string {
        return this._argument ? this._argument.type : null;
    }

    public get required (): boolean {
        return this._argument ? this._argument.required : null;
    }

    public get ast (): ESCodeGen.Literal | ESCodeGen.Identifier {
        return this.toAST();
    }

    constructor (
        private astService: ASTService,
        private stringToLiteralService: StringToLiteralService
    ) { }

    public init (method: Method, argument) {
        this._argument = argument;
        this._method = method;
    }

    private toAST (): ESCodeGen.Literal | ESCodeGen.Identifier {
        let literal = this.stringToLiteralService.toLiteral(this.value);
        let parameter = this.findParameter();
        let result = this.findResult();

        if (!isUndefined(literal) && literal !== this.value) {
            return this.astService.literal(literal);
        } else if (parameter) {
            return this.astService.identifier(parameter.variableName);
        } else if (result) {
            return this.astService.identifier(this.value);
        } else if (this.value) {
            return this.astService.literal(this.value);
        } else {
            return this.astService.literal(null);
        }
    }

    private findParameter (): Parameter {
        return this.method && this.method.interaction.action.parameters.find(parameter => {
            return parameter.name === this.value;
        });
    }

    private findResult (): Interaction {
        return this.method && this.method.interaction.action.interactions.find(interaction => {
            let returns = interaction.method[interaction.method.returns];
            return returns ? returns.name === this.value : false;
        });
    }
}

// TODO: Use angular utilities:
function isUndefined (obj: any): boolean {
    return obj === undefined;
}
