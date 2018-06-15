import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

/* import { ColorPickerModule } from 'narik-angular-color-picker'; */
import { MobileSketchToolComponent } from './mobile-sketch-tool.component';

describe('InspectionSketchToolComponent', () => {
  let component: MobileSketchToolComponent;
  let fixture: ComponentFixture<MobileSketchToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobileSketchToolComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileSketchToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
