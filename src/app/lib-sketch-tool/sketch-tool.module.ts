import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { MobileSketchToolComponent } from './mobile-component/mobile-sketch-tool.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [
    MobileSketchToolComponent
  ],
  exports: [MobileSketchToolComponent]
})
export class SketchToolModule {}
