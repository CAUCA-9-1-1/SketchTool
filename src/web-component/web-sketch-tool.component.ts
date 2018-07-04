import { Component, OnInit, Input, HostListener } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { CanvasManagerService } from './../services/canvas-manager.service';
import { AvailableGeometricShape } from './../constants/available-geometric-shapes';
import { KEY_CODE } from './../constants/key-code';
import { fabric } from 'fabric';

const Black = '#000000';

@Component({
  selector: 'lib-web-sketch-tool',
  templateUrl: './web-sketch-tool.component.html',
  styleUrls: ['./web-sketch-tool.component.scss'],
  providers: [CanvasManagerService]
})

export class WebSketchToolComponent implements OnInit {
  public fillColor: string;
  public strokeColor: string;

  public availableGeometricShapes = AvailableGeometricShape;
  public isDrawing: boolean;
  public isCropping: boolean;
  public isLastImage: boolean;

  @Input() public imgUrl: string;

  constructor(private canvasManagerService: CanvasManagerService) {
    this.strokeColor = Black;
    this.isDrawing = false;
    this.isCropping = false;
    this.isLastImage = false;
  }

  ngOnInit() {
    this.canvasManagerService.emptyCanvas();
    this.canvasManagerService.setBackgroundFromURL(this.imgUrl);
    this.isDrawing = false;
  }

  public addText() {
    this.canvasManagerService.addText(this.strokeColor, ' ');
  }

  public addShape(shape: string) {
    this.canvasManagerService.addGeometricShape(
      this.strokeColor,
      this.fillColor,
      AvailableGeometricShape[shape]
    );
  }

  public addImage(source: string) {
    if (!this.isDrawing) {
    }
  }

  public changeFillColor() {
    this.canvasManagerService.changeSelectedObjectsFillColor(this.fillColor);
  }

  public changeStrokeColor() {
    this.canvasManagerService.changeSelectedObjectsStrokeColor(
      this.strokeColor
    );
    this.canvasManagerService.setFreeDrawingBrushColor(this.strokeColor);
  }

  public bringFoward() {
    this.canvasManagerService.bringSelectedObjectsToFront();
  }

  public sendToBack() {
    this.canvasManagerService.sendSelectedObjectsToBack();
  }

  public draw() {
    this.isDrawing = !this.isDrawing;
    this.canvasManagerService.toggleFreeDrawing();
    this.canvasManagerService.setFreeDrawingBrushColor(this.strokeColor);
  }

  public saveImage() {
    const dataURL = this.canvasManagerService.exportImageAsDataURL();

    const link = document.createElement('a');
    link.download = 'image';

    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public crop() {
    this.isCropping = true;
    this.canvasManagerService.disableSelection();
    this.canvasManagerService.addSelectionRectangle();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.DELETE) {
      this.deleteSelection();
    }
  }

  public deleteSelection() {
    this.canvasManagerService.deleteSelectedObjects();
  }

  public mouseUp(event) {
    if (this.isCropping) {
      this.canvasManagerService.cropImage();
      this.isCropping = false;
    }
  }

  public mouseMove(event) {
    if (this.isCropping) {
      this.canvasManagerService.ajustCropRectangle(event);
    }
  }

  public mouseDown(event) {
    if (this.isCropping) {
      this.canvasManagerService.startSelectingCropRectangle(event);
    }
  }

  public group() {
    this.canvasManagerService.groupSelectedObjects();
  }
}
