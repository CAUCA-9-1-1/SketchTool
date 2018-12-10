import { Component, OnInit, Input, HostListener, Output, OnChanges, EventEmitter } from '@angular/core';
import { CanvasManagerService } from './../services/canvas-manager.service';
import { AvailableGeometricShape } from './../constants/available-geometric-shapes';
import { KEY_CODE } from './../constants/key-code';
import { fabric } from 'fabric';
import Guid from 'devextreme/core/guid';

const Black = '#000000';
const Transparent = 'transparent';

@Component({
  selector: 'lib-web-sketch-tool',
  templateUrl: './web-sketch-tool.component.html',
  styleUrls: ['./web-sketch-tool.component.scss'],
  providers: [CanvasManagerService]
})

export class WebSketchToolComponent implements OnInit, OnChanges {
  public fillColor: string;
  public strokeColor: string;

  public availableGeometricShapes = AvailableGeometricShape;
  public isDrawing: boolean;
  public isCropping: boolean;
  public isUndoAvailable: boolean;
  public canvasId = new Guid().toString();

  @Input() public imageData: string;
  @Input() public loadedJson: string;
  private previousJson: JSON;

  @Output() public canvas = new EventEmitter<fabric.Canvas>();

  get left() {
    return this.canvasManagerService.left;
  }

  constructor(private canvasManagerService: CanvasManagerService) {
    this.initializeSketchVariables();
  }

  ngOnInit() {
    this.canvasManagerService.createCanvas(this.canvasId);
  }

  ngOnChanges() {
    this.initializeSketchVariables();
    this.setCanvas();
  }

  private initializeSketchVariables() {
    this.strokeColor = Black;
    this.fillColor = Transparent;
    this.isCropping = false;
    this.isUndoAvailable = false;
  }

  private setCanvas() {
    if (this.imageData) {
      this.canvasManagerService.emptyCanvas();
      if (this.loadedJson == null || this.loadedJson.length < 10) {
        this.canvasManagerService.setBackgroundFromURL(this.imageData).then(() => {
          this.canvasManagerService.renderCanvas();
          this.emitCanvas();
        });
      } else {        
          this.previousJson = JSON.parse(this.loadedJson);
          this.canvasManagerService.loadfromJson(JSON.parse(this.loadedJson)).then(() => {
            this.canvasManagerService.renderCanvas();
            this.emitCanvas();
          });
      }
    }
  }

  public addText() {
    this.canvasManagerService.addText(this.strokeColor, ' ');
    this.emitCanvas();
  }

  public addShape(shape: string) {
    this.canvasManagerService.addGeometricShape(
      this.strokeColor,
      this.fillColor,
      AvailableGeometricShape[shape]
    );
    this.emitCanvas();
  }

  public changeStrokeColor() {
    this.canvasManagerService.changeSelectedObjectsStrokeColor(
      this.strokeColor
    );
    this.canvasManagerService.setFreeDrawingBrushColor(this.strokeColor);
    this.emitCanvas();
  }

  public bringFoward() {
    this.canvasManagerService.bringSelectedObjectsToFront();
    this.emitCanvas();
  }

  public sendToBack() {
    this.canvasManagerService.sendSelectedObjectsToBack();
    this.emitCanvas();
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
    this.isUndoAvailable = true;
    this.canvasManagerService.disableSelection();
    this.canvasManagerService.addSelectionRectangle();
    this.previousJson = this.canvasManagerService.jsonFromCanvas();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.DELETE) {
      this.deleteSelection();
    }
    this.emitCanvas();
  }

  public deleteSelection() {
    this.canvasManagerService.deleteSelectedObjects();
    this.emitCanvas();
  }

  public mouseUp(event) {
    if (this.isCropping) {
      this.canvasManagerService.cropImage();
      this.isCropping = false;
      this.isUndoAvailable = true;
    }
    this.emitCanvas();
  }

  public mouseMove(event: MouseEvent) {
    if (this.isCropping) {
      this.canvasManagerService.ajustCropRectangleFromMouse(event);
    }
  }

  public mouseDown(event: MouseEvent) {
    if (this.isCropping) {
      this.canvasManagerService.startSelectingCropRectangleFromMouse(event);
    }
  }

  public group() {
    this.canvasManagerService.groupSelectedObjects();
    this.emitCanvas();
  }

  public undo() {
    this.canvasManagerService.emptyCanvas();
    this.canvasManagerService.loadfromJson(this.previousJson);
    this.isUndoAvailable = false;
    this.emitCanvas();
  }

  public emitCanvas() {
    this.canvas.emit(this.canvasManagerService.canvas);
  }
}
