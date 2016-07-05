'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Dependencies:
import { COMPONENTS, FEATURES, PAGE_OBJECTS, MOCK_DATA, STEP_DEFINITIONS } from './types';

// Constants:
const FEATURES_SINGULAR = 'feature';
const PAGE_OBJECTS_SINGULAR = 'page-object';
const MOCK_DATA_SINGULAR = 'mock-data';
const STEP_DEFINITIONS_SINGULAR = 'step-definition';

const SINGULARS = {
    [COMPONENTS]: PAGE_OBJECTS_SINGULAR,
    [FEATURES]: FEATURES_SINGULAR,
    [PAGE_OBJECTS]: PAGE_OBJECTS_SINGULAR,
    [MOCK_DATA]: MOCK_DATA_SINGULAR,
    [STEP_DEFINITIONS]: STEP_DEFINITIONS_SINGULAR
};

@Injectable()
export class FileTypesService {
    private currentRoute: any;

    constructor () {
    }

    public getType (): string {
        // TODO: This is janky AF, couldn't find a good A2-y way of doing this.
        if (this.isRouteMatch(FEATURES_SINGULAR)) {
            return FEATURES;
        } else if (this.isRouteMatch(PAGE_OBJECTS_SINGULAR)) {
            // TODO: Fix this once the server knows about things being POs
            return COMPONENTS;
            // return PAGE_OBJECTS;
        } else if (this.isRouteMatch(MOCK_DATA_SINGULAR)) {
            return MOCK_DATA;
        } else if (this.isRouteMatch(STEP_DEFINITIONS_SINGULAR)) {
            return STEP_DEFINITIONS;
        } else {
            return null;
        }
    }

    public unpluralise (type: string): string {
        return SINGULARS[type];
    }

    private isRouteMatch (route: string): boolean {
        return new RegExp(`^/${route}`).test(location.pathname);
    }
}

export const FILE_TYPES_PROVIDERS = [
    FileTypesService
];
