import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ColorPickerModule } from 'narik-angular-color-picker';
import { WebSketchToolComponent } from './web-sketch-tool.component';

describe('InspectionSketchToolComponent', () => {
  let component: WebSketchToolComponent;
  let fixture: ComponentFixture<WebSketchToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WebSketchToolComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSketchToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
