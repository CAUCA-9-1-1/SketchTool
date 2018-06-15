import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {ColorPickerModule} from 'narik-angular-color-picker';

import { MobileSketchToolComponent } from './../mobile-component/mobile-sketch-tool.component';

/* import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; */

@NgModule({
  imports: [
    CommonModule,
    // ColorPickerModule,
/*     BrowserAnimationsModule, */
  ],
  declarations: [MobileSketchToolComponent],
  exports: [MobileSketchToolComponent]
})
export class MobileSketchToolModule {}
