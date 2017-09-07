'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { COMPONENTS, FEATURES, PAGE_OBJECTS, MOCK_DATA, STEP_DEFINITIONS } from './types';

@Injectable()
export class FileTypesService {
    constructor () { }

    // TODO: Get rid of this once the server knows about things being POs
    public getServerType (): string {
        if (this.isRouteMatch(FEATURES)) {
            return FEATURES;
        } else if (this.isRouteMatch(PAGE_OBJECTS)) {
            return COMPONENTS;
        } else if (this.isRouteMatch(MOCK_DATA)) {
            return MOCK_DATA;
        } else if (this.isRouteMatch(STEP_DEFINITIONS)) {
            return STEP_DEFINITIONS;
        } else {
            return null;
        }
    }

    public getType (): string {
        // TODO: This is janky AF, couldn't find a good A2-y way of doing this.
        if (this.isRouteMatch(FEATURES)) {
            return FEATURES;
        } else if (this.isRouteMatch(PAGE_OBJECTS)) {
            return PAGE_OBJECTS;
        } else if (this.isRouteMatch(MOCK_DATA)) {
            return MOCK_DATA;
        } else if (this.isRouteMatch(STEP_DEFINITIONS)) {
            return STEP_DEFINITIONS;
        } else {
            return null;
        }
    }

    private isRouteMatch (route: string): boolean {
        return new RegExp(`^/${route}`).test(location.pathname);
    }
}
