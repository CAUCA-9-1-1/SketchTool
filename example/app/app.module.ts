import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MobileSketchToolModule } from './../../src/modules/mobile-sketch-tool.module';
import { WebSketchToolModule } from './../../src/modules/web-sketch-tool.module';
import { SketchToolModule } from './../../src/modules/test.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    MobileSketchToolModule,
    WebSketchToolModule,
    SketchToolModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
