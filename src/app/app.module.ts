import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { WebSketchToolModule } from 'lib-sketch-tool';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    WebSketchToolModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
