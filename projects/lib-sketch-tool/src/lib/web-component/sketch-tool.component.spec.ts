import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ColorPickerModule } from 'narik-angular-color-picker';
import { SketchToolComponent } from './sketch-tool.component';

describe('InspectionSketchToolComponent', () => {
  let component: SketchToolComponent;
  let fixture: ComponentFixture<SketchToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SketchToolComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
