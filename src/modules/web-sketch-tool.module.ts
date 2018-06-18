import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// import {ColorPickerModule} from 'narik-angular-color-picker';

import { WebSketchToolComponent } from './../web-component/web-sketch-tool.component';

@NgModule({
  imports: [
    CommonModule,
    // ColorPickerModule,
  ],
  declarations: [
    WebSketchToolComponent
  ],
  exports: [
    WebSketchToolComponent,
  ]
})
export class WebSketchToolModule {}

