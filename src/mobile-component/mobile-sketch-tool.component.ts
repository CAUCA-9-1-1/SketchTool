import {Component, Input, OnInit} from '@angular/core';
import {ActionSheetController} from 'ionic-angular';

import {AvailableGeometricShape} from './../constants/available-geometric-shapes';
import {CanvasManagerService} from './../services/canvas-manager.service';

const Black = '#000000';

@Component({
  selector: 'lib-mobile-sketch-tool',
  templateUrl: './mobile-sketch-tool.component.html',
  styleUrls: [
    '/src/lib-sketch-tool/mobile-component/mobile-sketch-tool.component.scss'
  ],
  providers: [CanvasManagerService]
})
export class MobileSketchToolComponent implements OnInit {
  public fillColor: string;
  public strokeColor: string;
  public shape: string;

  public availableGeometricShapes = AvailableGeometricShape;
  public isDrawing: boolean;
  public isCropping: boolean;
  public isLastImage: boolean;

  public shapePlaceholder = 'Formes';
  public iconPlaceholder = 'Icones';
  public editPlaceholder = 'Édition';

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
  }

  ngOnInit() {
    this.canvasManagerService.emptyCanvas();
    this.canvasManagerService.setBackgroundFromURL(this.imgUrl, 0.8);
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
  }

  public deleteSelection() {
    this.canvasManagerService.deleteSelectedObjects();
  }

  public mouseUp(event) {
    if (this.isCropping) {
      this.canvasManagerService.cropImage();
      this.isCropping = false;
    } else {
      this.canvasManagerService.unselectAndReselectObjects();
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

  public presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Ajouter une forme',
      buttons: [
        {
          text: '\uf0c8',
          handler: () => {
            this.canvasManagerService.addGeometricShape(this.strokeColor, this.fillColor, AvailableGeometricShape.Rectangle);
          }
        },
        {
          text: '\uf0d8',
          handler: () => {
            this.canvasManagerService.addGeometricShape(this.strokeColor, this.fillColor, AvailableGeometricShape.Triangle);
          }
        },
        {
          text: '\uf111',
          handler: () => {
            this.canvasManagerService.addGeometricShape(this.strokeColor, this.fillColor, AvailableGeometricShape.Circle);
          }
        },
        {
          text: '\uf068',
          handler: () => {
            this.canvasManagerService.addGeometricShape(this.strokeColor, this.fillColor, AvailableGeometricShape.Line);
          }
        },
        {
          text: '\uf067',
          handler: () => {
            this.canvasManagerService.addGeometricShape(this.strokeColor, this.fillColor, AvailableGeometricShape.Cross);
          }
        },
        {
          text: '\uf031',
          handler: () => {
            this.canvasManagerService.addText(this.strokeColor, "");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
