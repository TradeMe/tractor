'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Argument, ArgumentFactory } from '../argument/argument';
import { Factory } from '../../../shared/factory/factory.interface';
import { Interaction } from '../interaction/interaction';

@Injectable()
export class MethodFactory implements Factory<Method> {
    constructor (
        private argumentFactory: ArgumentFactory
    ) { }

    create (interaction: Interaction, method) {
        let instance = new Method(this.argumentFactory);
        instance.init(interaction, method);
        return instance;
    }
}

export class Method {
    private _interaction: Interaction;
    private _method: Method;

    public arguments: Array<Argument>;

    public get interaction (): Interaction {
        return this._interaction;
    }

    public get method () {
        return this._method;
    }

    public get name (): string {
        return this.method.name;
    }

    public get description (): string {
        return this.method.description;
    }

    public get returns (): string {
        return this.method.returns;
    }

    constructor (
        private argumentFactory: ArgumentFactory
    ) { }

    public init (interaction: Interaction, method) {
        this._interaction = interaction;
        this._method = method;

        this.arguments = this.getArguments();

        if (this.returns) {
            this[this.returns] = this.method[this.returns];
        }
    }

    private getArguments (): Array<Argument> {
        if (this.method.arguments) {
            return this.method.arguments.map(argument => this.argumentFactory.create(this, argument));
        } else {
            return [];
        }
    }
}
