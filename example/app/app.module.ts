import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SketchToolModule } from './../../src/modules/sketch-tool.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    SketchToolModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
