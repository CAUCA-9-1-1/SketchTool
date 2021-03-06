import {Directive, Output, HostListener, EventEmitter} from '@angular/core';

@Directive({
  selector: '[libCanvasClick]'
})

export class CanvasClickDirective {

  @Output() mouseUp: EventEmitter<boolean> = new EventEmitter<false>();
  @Output() mouseDown: EventEmitter<boolean> = new EventEmitter<false>();
  @Output() mouseMove: EventEmitter<boolean> = new EventEmitter<false>();

  @HostListener('mouseup', ['$event'])
  onMouseUp(event): void {
    this.mouseUp.emit(event);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.mouseDown.emit(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMouve(event) {
    this.mouseMove.emit(event);
  }
}
