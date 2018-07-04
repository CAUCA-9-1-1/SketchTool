import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileSketchToolComponent } from './../mobile-component/mobile-sketch-tool.component';
import { WebSketchToolComponent } from './../web-component/web-sketch-tool.component';
import { TestCanvasClickComponent } from './../directives/canvas-click.directive.spec';

import { CanvasClickDirective } from './../directives/canvas-click.directive';

import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {IonicApp, IonicModule} from 'ionic-angular';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MatSelectModule, IonicModule],
  declarations: [
    CanvasClickDirective,
    WebSketchToolComponent,
    MobileSketchToolComponent,
    TestCanvasClickComponent,
  ],
  exports: [MobileSketchToolComponent]
})
export class SketchToolModule {}
