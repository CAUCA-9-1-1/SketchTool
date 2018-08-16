import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { MobileSketchToolComponent } from './mobile-component/mobile-sketch-tool.component';
import { CanvasManagerService } from './services/canvas-manager.service';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [
    MobileSketchToolComponent,
  ],
  providers: [
    CanvasManagerService,
  ],
  exports: [MobileSketchToolComponent]
})
export class SketchToolModule {}
