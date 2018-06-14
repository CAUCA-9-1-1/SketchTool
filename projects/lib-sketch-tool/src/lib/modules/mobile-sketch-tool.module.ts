import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {ColorPickerModule} from 'narik-angular-color-picker';

import { MobileSketchToolComponent } from './../mobile-component/mobile-sketch-tool.component';

import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    // ColorPickerModule,
    MatSelectModule,
    BrowserAnimationsModule,
  ],
  declarations: [MobileSketchToolComponent],
  exports: [MobileSketchToolComponent]
})
export class MobileSketchToolModule {}
