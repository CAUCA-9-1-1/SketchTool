import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {ColorPickerModule} from 'narik-angular-color-picker';

import { MobileSketchToolComponent } from './../mobile-component/mobile-sketch-tool.component';
import { WebSketchToolComponent } from './../web-component/web-sketch-tool.component';
import { TestCanvasClickComponent } from './../directives/canvas-click.directive.spec';

import { CanvasClickDirective } from './../directives/canvas-click.directive';

import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MatSelectModule],
  declarations: [
    CanvasClickDirective,
    WebSketchToolComponent,
    MobileSketchToolComponent,
    TestCanvasClickComponent,
  ],
  exports: [MobileSketchToolComponent]
})
export class SketchToolModule {}
