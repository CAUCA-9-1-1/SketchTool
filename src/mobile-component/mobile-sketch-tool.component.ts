import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

import { AvailableGeometricShape } from './../constants/available-geometric-shapes';
import { CanvasManagerService } from './../services/canvas-manager.service';

const Black = '#000000';

@Component({
  selector: 'lib-mobile-sketch-tool',
  templateUrl: './mobile-sketch-tool.component.html',
  styleUrls: [
    '/src/lib-sketch-tool/mobile-component/mobile-sketch-tool.component.scss'
  ],
  providers: [CanvasManagerService]
})
export class MobileSketchToolComponent implements OnInit, OnChanges {
  public fillColor: string;
  public strokeColor: string;
  public shape: string;

  public availableGeometricShapes = AvailableGeometricShape;
  public isDrawing: boolean;
  public isCropping: boolean;
  public isLastImage: boolean;

  private isLoaded: boolean;

  @Input() public imgUrl: string;
  @Input() public iconsPath: string;
  @Input() public icons: [string];

  constructor(
    private canvasManagerService: CanvasManagerService,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.strokeColor = Black;
    this.isDrawing = false;
    this.isCropping = false;
    this.isLastImage = false;
    this.isLoaded = false;
  }

  ngOnInit() {
    this.canvasManagerService.emptyCanvas();
    this.canvasManagerService.setBackgroundFromURL(this.imgUrl, 0.8);
    this.isDrawing = false;
    this.isLoaded = true;
  }

  ngOnChanges() {
    if (this.isLoaded) {
      this.canvasManagerService.emptyCanvas();
      this.canvasManagerService.setBackgroundFromURL(this.imgUrl, 0.8);
      this.isDrawing = false;
    }
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
      this.canvasManagerService.addImage(this.iconsPath + source);
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
    console.log('Crop');
  }

  public deleteSelection() {
    this.canvasManagerService.deleteSelectedObjects();
  }

  public mouseUp(event) {
    console.log('up');
    if (this.isCropping) {
      this.isCropping = false;
      this.canvasManagerService.cropImage();
    } else {
      this.canvasManagerService.unselectAndReselectObjects();
    }
  }

  public mouseMove(event) {
    console.log('move');
    if (this.isCropping) {
      this.canvasManagerService.ajustCropRectangle(event);
    }
  }

  public mouseDown(event) {
    console.log('down');
    if (this.isCropping) {
      this.canvasManagerService.startSelectingCropRectangle(event);
    }
  }

  public nextImage() {
    this.canvasManagerService.emptyCanvas();
    this.canvasManagerService.setBackgroundFromURL(
      'assets/demo/IMG_3739.jpg',
      1.45
    );
    this.isDrawing = false;
    this.isLastImage = true;
  }

  public group() {
    this.canvasManagerService.groupSelectedObjects();
  }

  public presentShapeActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Ajouter une forme',
      buttons: [
        {
          text: '\uf0c8   Rectangle',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Rectangle
            );
          }
        },
        {
          text: '\uf0d8   Triangle',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Triangle
            );
          }
        },
        {
          text: '\uf111   Cercle',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Circle
            );
          }
        },
        {
          text: '\uf068   Ligne',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Line
            );
          }
        },
        {
          text: '\uf067   Croix',
          handler: () => {
            this.canvasManagerService.addGeometricShape(
              this.strokeColor,
              this.fillColor,
              AvailableGeometricShape.Cross
            );
          }
        },
        {
          text: '\uf031   Texte',
          handler: () => {
            this.canvasManagerService.addText(this.strokeColor, '');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public presentEditActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Édition',
      buttons: [
        {
          text: '\uf125 \u0020 Rogner',
          handler: () => {
            this.crop();
          }
        },
        {
          text: '\uf247   Grouper',
          handler: () => {
            this.group();
          }
        },
        {
          text: '\uf0de   Avancer',
          handler: () => {
            this.bringFoward();
          }
        },
        {
          text: '\uf0dd   Reculer',
          handler: () => {
            this.sendToBack();
          }
        },
        {
          text: '\uf1f8   Supprimer',
          handler: () => {
            this.deleteSelection();
          }
        }
      ]
    });
    actionSheet.present();
  }

  public presentPictogramsActionSheet() {
    let buttons = [];
    let actionSheetStyles = [];
    let images = this.icons;
    for (let i = 0; i < images.length; i++) {
      let style = document.createElement('style');
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
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ajouter un pictogramme',
      buttons: buttons
    });
    actionSheet.onDidDismiss(() => {
      // Don't forget to delete css styles on close of actionSheet:
      for (let i = 0; i < actionSheetStyles.length; i++) {
        if (actionSheetStyles[i].parentNode != null)
          actionSheetStyles[i].parentNode.removeChild(actionSheetStyles[i]);
      }
    });

    actionSheet.present();
  }
}
