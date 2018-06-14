import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// import {ColorPickerModule} from 'narik-angular-color-picker';

import { WebSketchToolComponent } from './../web-component/web-sketch-tool.component';
import { CanvasClickDirective } from './../directives/canvas-click.directive';

@NgModule({
  imports: [
    CommonModule,
    // ColorPickerModule,
  ],
  declarations: [
    CanvasClickDirective,
    WebSketchToolComponent
  ],
  exports: [
    WebSketchToolComponent,
  ]
})
export class WebSketchToolModule {}

