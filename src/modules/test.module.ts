import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestCanvasClickComponent } from './../directives/canvas-click.directive.spec';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [TestCanvasClickComponent],
  exports: []
})
export class SketchToolModule {}
