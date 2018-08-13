import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatButtonModule } from '@angular/material';

import { WebSketchToolComponent } from './web-component/web-sketch-tool.component';

@NgModule({
  imports: [CommonModule, ColorPickerModule, MatButtonModule, MatToolbarModule],
  declarations: [WebSketchToolComponent],
  exports: [WebSketchToolComponent]
})
export class WebSketchToolModule {}
