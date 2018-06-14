import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {ColorPickerModule} from 'narik-angular-color-picker';

import { MobileSketchToolModule } from './mobile-sketch-tool.module';
import { WebSketchToolModule } from './web-sketch-tool.module';

import { CanvasClickDirective } from './../directives/canvas-click.directive';

import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    // ColorPickerModule,
    WebSketchToolModule,
    MobileSketchToolModule,
    MatSelectModule,
  ],
  declarations: [CanvasClickDirective],
  exports: []
})
export class SketchToolModule {}
