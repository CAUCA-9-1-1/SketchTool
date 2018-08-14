import { Component, Input, Output, OnInit, OnChanges, AfterViewInit, EventEmitter, transition, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { Gesture } from 'ionic-angular/gestures/gesture';
import { AvailableGeometricShape } from './../constants/available-geometric-shapes';
import { CanvasManagerService } from './../services/canvas-manager.service';
import { fabric } from 'fabric';
import { TranslateService } from "@ngx-translate/core";

const Black = '#000000';
const Transparent = 'transparent';

@Component({
  selector: 'lib-mobile-sketch-tool',
  templateUrl: './mobile-sketch-tool.component.html',
  styleUrls: ['./mobile-sketch-tool.component.scss'],
  providers: [CanvasManagerService]
})
export class MobileSketchToolComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  private gesture: Gesture;
  @ViewChild('pinchElement') element;

  public fillColor: string;
  public strokeColor: string;
  public isCropping: boolean;
  public isUndoAvailable: boolean;
  public isSelectingColor: boolean;
  public isDrawing: boolean;

  @Input() public imageData: string;
  @Input() public loadedJson: string;
  @Input() public iconsPath: string;
  @Input() public icons: [string];

  @Output() public canvas = new EventEmitter<fabric.Canvas>();

  private isLoaded: boolean;
  private isPanning: boolean;
  private previousImageData: string;
  private currentJson: JSON;
  private previousJson: JSON;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private canvasManagerService: CanvasManagerService,
    private translate: TranslateService
  ) {
    this.strokeColor = Black;
    this.fillColor = Transparent;
    this.isCropping = false;
    this.isLoaded = false;
    this.isUndoAvailable = false;
    this.isSelectingColor = false;
  }

  ngOnInit() {
    if (this.imageData) {
      this.canvasManagerService.emptyCanvas();
      if (this.loadedJson == null || this.loadedJson.length < 10) {
        this.canvasManagerService.setBackgroundFromURL(this.imageData);
      } else {
        this.previousJson = JSON.parse(this.loadedJson);
        this.currentJson = this.previousJson;
        this.canvasManagerService
          .loadfromJson(JSON.parse(this.loadedJson));
      }
      this.isLoaded = true;
      this.previousImageData = this.imageData;
    }
    this.emitCanvas();
  }

  ngOnChanges() {
    if (this.isLoaded) {
      if (this.loadedJson === null || this.loadedJson.length < 10 || this.imageData !== this.previousImageData) {
        this.canvasManagerService.emptyCanvas();
        this.canvasManagerService.setBackgroundFromURL(this.imageData);
        this.previousImageData = this.imageData;
        this.currentJson = null;
      } else if (this.loadedJson !== JSON.stringify(this.currentJson)) {
          this.previousJson = JSON.parse(this.loadedJson);
          this.currentJson = this.previousJson;
          this.canvasManagerService
            .loadfromJson(JSON.parse(this.loadedJson));
      }
    }
    this.emitCanvas();
  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad');
    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.element.nativeElement);
    console.log(this.gesture);
  
    //listen for the gesture
    this.gesture.listen();
  
    //turn on listening for pinch or rotate events
    this.gesture.on('pinch', $event => this.pinch($event));
  }

  ngOnDestroy() {
    this.gesture.destroy();
}
  
  private pinchEvent(event) {
      this.canvasManagerService.emptyCanvas();
  }

  get hasPictograms(): boolean {
    return !(!this.icons);
  }

  public addText() {
    this.canvasManagerService.addText(this.strokeColor, 'text ');
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

  public addImage(source: string) {
    this.canvasManagerService.addImage(this.iconsPath + source);
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

  public crop() {
    this.isCropping = true;
    this.canvasManagerService.disableSelection();
    this.canvasManagerService.addSelectionRectangle();
    this.isUndoAvailable = true;
    this.previousJson = this.canvasManagerService.jsonFromCanvas();
    this.emitCanvas();
  }

  public deleteSelection() {
    this.canvasManagerService.deleteSelectedObjects();
    this.emitCanvas();
  }

  public mouseUp(event) {
    if (this.isCropping) {
      this.isCropping = false;
      this.canvasManagerService.cropImage();
      this.isUndoAvailable = true;
      this.emitCanvas();
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

  public pan(event) {
    if (!this.isCropping) {
      this.isPanning = true;
      if (this.isPanning && event && event.e) {
        this.canvasManagerService.panCanvas(event);
      }
      this.isPanning = false;
    }
  }

  public pinch(event){
    event.preventDefault(); 
    console.log(event);
    this.canvasManagerService.zoom(event);
  }

  public group() {
    this.canvasManagerService.groupSelectedObjects();
    this.emitCanvas();
  }

  public undo() {
    this.canvasManagerService.loadfromJson(this.previousJson);
    this.isUndoAvailable = false;
    this.emitCanvas();
  }

  public onColorClicked() {
    this.isSelectingColor = true;
  }

  public setColor(color: string) {
    this.strokeColor = color;
    this.changeStrokeColor();
    this.isSelectingColor = false;
    this.emitCanvas();
  }

  public draw() {
    this.isDrawing = !this.isDrawing;
    this.canvasManagerService.toggleFreeDrawing();
    this.canvasManagerService.setFreeDrawingBrushColor(this.strokeColor);
  }

  private disableDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.canvasManagerService.toggleFreeDrawing();
    }
  }

  private translateShapeButtonsText(): Array<String> {
    const translationArray = [];
    translationArray.push(this.translate.instant('rectangle'));
    translationArray.push(this.translate.instant('triangle'));
    translationArray.push(this.translate.instant('circle'));
    translationArray.push(this.translate.instant('line'));
    translationArray.push(this.translate.instant('cross'));
    translationArray.push(this.translate.instant('text'));
    return translationArray;
  }

  public presentShapeActionSheet() {
    this.disableDrawing();

    const titleText = this.translate.instant('addGeometricShape');
    const buttonsText = this.translateShapeButtonsText();
    let i = 0;

    const actionSheet = this.actionSheetCtrl.create({
      title: titleText,
      buttons: [
        {
          text: '\uf0c8   ' + buttonsText[i++],
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Rectangle
            );
          }
        },
        {
          text: '\uf0d8   ' + buttonsText[i++],
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Triangle
            );
          }
        },
        {
          text: '\uf111   ' + buttonsText[i++],
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Circle
            );
          }
        },
        {
          text: '\uf068   ' + buttonsText[i++],
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Line
            );
          }
        },
        {
          text: '\uf067   ' + buttonsText[i++],
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Cross
            );
          }
        },
        {
          text: '\uf031   ' + buttonsText[i++],
          handler: () => {
            this.canvasManagerService.addText(this.strokeColor, '');
          }
        }
      ]
    });
    actionSheet.present();
  }

  private translateEditButtonsText(): Array<String> {
    const translationArray = [];
    translationArray.push(this.translate.instant('crop'));
    translationArray.push(this.translate.instant('group'));
    translationArray.push(this.translate.instant('bringToFront'));
    translationArray.push(this.translate.instant('sendToBack'));
    translationArray.push(this.translate.instant('delete'));
    return translationArray;
  }

  public presentEditActionSheet() {
    this.disableDrawing();

    const titleText = this.translate.instant('edition');

    const buttonsText = this.translateEditButtonsText();
    let i = 0;

    const actionSheet = this.actionSheetCtrl.create({
      title: titleText,
      buttons: [
        {
          text: '\uf125 ' + buttonsText[i++],
          handler: () => {
            this.crop();
          }
        },
        {
          text: '\uf247   ' + buttonsText[i++],
          handler: () => {
            this.group();
          }
        },
        {
          text: '\uf0de   ' + buttonsText[i++],
          handler: () => {
            this.bringFoward();
          }
        },
        {
          text: '\uf0dd   ' + buttonsText[i++],
          handler: () => {
            this.sendToBack();
          }
        },
        {
          text: '\uf1f8   ' + buttonsText[i++],
          handler: () => {
            this.deleteSelection();
          }
        }
      ]
    });
    actionSheet.present();
  }

  public presentPictogramsActionSheet() {
    this.disableDrawing();

    const buttons = [];
    const actionSheetStyles = [];
    const images = this.icons;
    for (let i = 0; i < images.length; i++) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML =
        '.customCSSClass' +
        i +
        '{background: url(' +
        "'" +
        this.iconsPath +
        images[i] +
        "'" +
        ') no-repeat !important;padding-left:50px !important;height:80px; background-position: left center !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      actionSheetStyles.push(style);
      buttons.push({
        role: 'destructive',
        text: images[i],
        cssClass: 'customCSSClass' + i,
        handler: () => {
          this.addImage(images[i]);
        }
      });
    }

    const titleText = this.translate.instant('addPictogram');

    const actionSheet = this.actionSheetCtrl.create({
      title: titleText,
      buttons: buttons
    });
    actionSheet.onDidDismiss(() => {
      for (let i = 0; i < actionSheetStyles.length; i++) {
        if (actionSheetStyles[i].parentNode != null) {
          actionSheetStyles[i].parentNode.removeChild(actionSheetStyles[i]);
        }
      }
    });

    actionSheet.present();
  }

  public emitCanvas() {
    this.canvas.emit(this.canvasManagerService.canvas);
  }
}
