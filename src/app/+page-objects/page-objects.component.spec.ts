import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PageObjectsComponent } from './page-objects.component';

describe('Component: PageObjects', () => {
    let builder: TestComponentBuilder;

    beforeEachProviders(() => [PageObjectsComponent]);
    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        builder = tcb;
    }));

    it('should inject the component', inject([PageObjectsComponent], (component: PageObjectsComponent) => {
        expect(component).toBeTruthy();
    }));

    it('should create the component', inject([], () => {
        return builder.createAsync(PageObjectsComponentTestController)
        .then((fixture: ComponentFixture<any>) => {
            let query = fixture.debugElement.query(By.directive(PageObjectsComponent));
            expect(query).toBeTruthy();
            expect(query.componentInstance).toBeTruthy();
        });
    }));
});

@Component({
    selector: 'test',
    template: `
        <tractor-page-objects></tractor-page-objects>
    `,
    directives: [PageObjectsComponent]
})
class PageObjectsComponentTestController {
}
