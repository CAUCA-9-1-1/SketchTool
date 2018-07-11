import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, Directive } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CanvasClickDirective } from './canvas-click.directive';

@Component({
  selector: 'lib-test-canvas-click',
  template: '<input type="text" libCanvasClick ' +
  '(mouseDown)="mouseDown($event)" (mouseMove)="mouseMove($event)" (mouseUp)="mouseUp($event)" >'
})
export class TestCanvasClickComponent {
  public mouseUp(event) {}
  public mouseMove(event) {}
  public mouseDown(event) {}
}

describe('CanvasClickDirective', () => {
  let component: TestCanvasClickComponent;
  let fixture: ComponentFixture<TestCanvasClickComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestCanvasClickComponent, CanvasClickDirective]
    });
    fixture = TestBed.createComponent(TestCanvasClickComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should create an instance', () => {
    const directive = new CanvasClickDirective();
    expect(directive).toBeTruthy();
  });

  it('should emit on mouse up', async(() => {
    spyOn(component, 'mouseUp');

    inputEl.triggerEventHandler('mouseup', null);

    fixture.whenStable().then(() => {
      expect(component.mouseUp).toHaveBeenCalled();
    });
  }));

  it('should emit on mouse down', async(() => {
    spyOn(component, 'mouseDown');

    inputEl.triggerEventHandler('mousedown', null);

    fixture.whenStable().then(() => {
      expect(component.mouseDown).toHaveBeenCalled();
    });
  }));

  it('should emit on mouse mouve', async(() => {
    spyOn(component, 'mouseMove');

    inputEl.triggerEventHandler('mousemove', null);

    fixture.whenStable().then(() => {
      expect(component.mouseMove).toHaveBeenCalled();
    });
  }));
});
