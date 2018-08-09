import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SketchToolModule } from './src/app/lib-sketch-tool/sketch-tool.module';
import { environment } from './config/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SketchToolModule)
  .catch(err => console.log(err));
