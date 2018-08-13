import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatButtonModule } from '@angular/material';

import { WebSketchToolComponent } from './lib-sketch-tool/web-component/web-sketch-tool.component';

@NgModule({
  declarations: [
    AppComponent,
    WebSketchToolComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    ColorPickerModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
