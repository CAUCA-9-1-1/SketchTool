import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public imageUrl: string;
  public isShowingResult: boolean;

  private canvas;

  constructor(translate: TranslateService) {
    this.imageUrl = '';
    this.isShowingResult = false;

    translate.setDefaultLang('en');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.imageUrl = 'assets/implentation-plan-example-picture.png';
    })
  }

  get resultJson(): string {
    return JSON.stringify(this.canvas.toJSON());
  }

  get resultImgUri() {
    return this.canvas.toDataURL();
  }

  public updateCanvas($event) {
    this.canvas = $event;
  }

  public showResult() {
    this.isShowingResult = true;
  }
}
