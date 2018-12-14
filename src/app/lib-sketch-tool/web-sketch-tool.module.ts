import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatButtonModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';

import { WebSketchToolComponent } from './web-component/web-sketch-tool.component';
import { CanvasManagerService } from './services/canvas-manager.service';

@NgModule({
  imports: [CommonModule, ColorPickerModule, MatButtonModule, MatToolbarModule, NoopAnimationsModule, MatTooltipModule],
  declarations: [WebSketchToolComponent],
  providers: [CanvasManagerService],
  exports: [WebSketchToolComponent]
})
export class WebSketchToolModule { }
