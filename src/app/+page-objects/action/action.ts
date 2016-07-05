'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as camelcase from 'camel-case';
import * as dedent from 'dedent';

// Dependencies:
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import { Factory } from '../../shared/factory/factory.interface.ts';
import { Interaction, InteractionFactory, INTERACTION_PROVIDERS } from '../interaction/interaction';
import { PageObject } from '../page-object/page-object';
import { Parameter, ParameterFactory, PARAMETER_PROVIDERS } from '../parameter/parameter';

@Injectable()
export class ActionFactory implements Factory<Action> {
    constructor (
        private astService: ASTService,
        private interactionFactory: InteractionFactory,
        private parameterFactory: ParameterFactory
    ) { }

    public create (pageObject: PageObject): Action {
        let instance = new Action(pageObject);
        instance.setServices(this.astService, this.interactionFactory, this.parameterFactory);
        return instance;
    }
}

export class Action {
    private _interactions: Array<Interaction> = [];
    private _pageObject: PageObject;
    private _parameters: Array<Parameter> = [];

    private astService: ASTService;
    private interactionFactory: InteractionFactory;
    private parameterFactory: ParameterFactory;

    public name: string = '';

    public get interactions (): Array<Interaction> {
        return this._interactions;
    }

    public get pageObject (): PageObject {
        return this._pageObject;
    }

    public get parameters (): Array<Parameter> {
        return this._parameters;
    }

    public get variableName (): string {
        return camelcase(this.name);
    }

    public get meta () {
        return {
            name: this.name,
            parameters: this.parameters.map(parameter => parameter.meta)
        };
    }

    public get ast (): ESCodeGen.Expression {
        return this.toAST();
    }

    constructor (pageObject: PageObject) {
        this._pageObject = pageObject;
    }

    public setServices (astService: ASTService, interactionFactory: InteractionFactory, parameterFactory: ParameterFactory): void {
        this.astService = astService;
        this.interactionFactory = interactionFactory;
        this.parameterFactory = parameterFactory;
    }

    public addParameter (parameter?: Parameter): void {
        if (!parameter) {
            parameter = this.parameterFactory.create(this);
        }
        this.parameters.push(parameter);
    }

    public removeParameter (toRemove: Parameter): void {
        this.parameters.splice(this.parameters.findIndex(parameter => {
            return parameter === toRemove;
        }), 1);
    }

    public addInteraction (interaction?: Interaction): void {
        if (!interaction) {
            interaction = this.interactionFactory.create(this);
        }
        interaction.element = interaction.element || this.pageObject.browser;
        this.interactions.push(interaction);
    }

    public removeInteraction (toRemove: Interaction): void {
        this.interactions.splice(this.interactions.findIndex(interaction => {
            return interaction === toRemove;
        }), 1);
    }

    public getAllVariableNames (): Array<string> {
        return this.pageObject.getAllVariableNames(this);
    }

    private toAST (): ESCodeGen.Expression {
        let action = this.astService.identifier(this.variableName);
        let pageObject = this.astService.identifier(this.pageObject.variableName);
        let parameters = this.parameters.map(parameter => parameter.ast);
        let interactions = this.interactionsAST();

        let template = '<%= pageObject %>.prototype.<%= action %> = function (%= parameters %) {';
        if (interactions) {
            template += dedent(`
                var self = this;
                return <%= interactions %>;
            `);
        }
        template += '};';

        return this.astService.expression(template, { pageObject, action, parameters, interactions });
    }

    private interactionsAST (): ESCodeGen.Expression {
        let template = '';
        let fragments = {};
        this.interactions.reduce((previousInteraction: Interaction, interaction: Interaction, index: number) => {
            let interactionTemplate = `<%= interaction${index} %>`;

            if (template.length) {
                template += dedent(`
                    .then(function (%= parameter${index} %) {
                        return ${interactionTemplate};
                    })
                `);
            } else {
                template += interactionTemplate;
            }

            fragments[`interaction${index}`] = interaction.ast;
            fragments[`parameter${index}`] = [];

            let previousResult = this.previousInteractionResult(previousInteraction);
            if (previousResult) {
                let parameter = this.astService.identifier(previousResult);
                fragments[`parameter${index}`].push(parameter);
            }

            return interaction;
        }, {});

        return this.astService.expression(template, fragments);
    }

    private previousInteractionResult (previous: Interaction): string {
        let returns: string = previous && previous.method && previous.method.returns;
        if (returns && previous.method[returns]) {
            return previous.method[returns].name;
        }
    }
}

export const ACTION_PROVIDERS = [
    ActionFactory,
    AST_PROVIDERS,
    INTERACTION_PROVIDERS,
    PARAMETER_PROVIDERS
];
