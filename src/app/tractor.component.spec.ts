import {
    beforeEachProviders,
    describe,
    expect,
    it,
    inject
} from '@angular/core/testing';

import { TractorAppComponent } from '../app/tractor.component';

beforeEachProviders(() => [TractorAppComponent]);

describe('App: Tractor', () => {
    it('should create the app', inject([TractorAppComponent], (app: TractorAppComponent) => {
        expect(app).toBeTruthy();
    }));
});
