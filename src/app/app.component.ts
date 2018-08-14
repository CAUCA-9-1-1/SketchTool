import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public imageUrl = 'assets/implentation-plan-example-picture.png';
  public isShowingResult: boolean;

  private canvas;

  constructor() {
    this.isShowingResult = false;
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
