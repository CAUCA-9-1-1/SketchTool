import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatButtonModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { WebSketchToolComponent } from './web-component/web-sketch-tool.component';
import { CanvasManagerService } from './services/canvas-manager.service';

@NgModule({
  imports: [CommonModule, ColorPickerModule, MatButtonModule, MatToolbarModule, MatTooltipModule, NoopAnimationsModule],
  declarations: [WebSketchToolComponent],
  providers: [CanvasManagerService],
  exports: [WebSketchToolComponent]
})
export class WebSketchToolModule { }
