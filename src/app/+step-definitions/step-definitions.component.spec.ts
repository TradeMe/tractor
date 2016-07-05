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
import { StepDefinitionsComponent } from './step-definitions.component';

describe('Component: StepDefinitions', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [StepDefinitionsComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([StepDefinitionsComponent],
      (component: StepDefinitionsComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(StepDefinitionsComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(StepDefinitionsComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-step-definitions></app-step-definitions>
  `,
  directives: [StepDefinitionsComponent]
})
class StepDefinitionsComponentTestController {
}

