import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* import {ColorPickerModule} from 'narik-angular-color-picker'; */

import { MobileSketchToolModule } from './mobile-sketch-tool.module';
import { WebSketchToolModule } from './web-sketch-tool.module';
import { CanvasClickDirective } from './../directives/canvas-click.directive';



@NgModule({
  imports: [
    CommonModule,
/*     ColorPickerModule, */
    WebSketchToolModule,
    MobileSketchToolModule,
  ],
  declarations: [CanvasClickDirective],
  exports: []
})
export class SketchToolModule {}
