import { Component, Input, Output, OnInit, OnChanges, EventEmitter} from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { AvailableGeometricShape } from './../constants/available-geometric-shapes';
import { CanvasManagerService } from './../services/canvas-manager.service';

const Black = '#000000';
const Transparent = 'transparent';

@Component({
  selector: 'lib-mobile-sketch-tool',
  templateUrl: './mobile-sketch-tool.component.html',
  styleUrls: ['./mobile-sketch-tool.component.scss'],
  providers: [CanvasManagerService]
})
export class MobileSketchToolComponent implements OnInit, OnChanges {
  public fillColor: string;
  public strokeColor: string;
  public isCropping: boolean;
  public isUndoAvailable: boolean;
  public isSelectingColor: boolean;

  @Input() public imageData: string;
  @Input() public loadedJson: string;
  @Input() public iconsPath: string;
  @Input() public icons: [string];

  @Output() public json = new EventEmitter<string>();

  private isLoaded: boolean;
  private previousImageData: string;
  private currentJson: JSON;
  private previousJson: JSON;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private canvasManagerService: CanvasManagerService
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
      if (this.loadedJson == null || this.loadedJson === '') {
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
  }

  ngOnChanges() {
    if (this.isLoaded) {
      if (this.loadedJson === '' || this.loadedJson === null || this.imageData !== this.previousImageData) {
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
  }

  get hasPictograms(): boolean {
    return !(!this.icons);
  }

  public addText() {
    this.canvasManagerService.addText(this.strokeColor, 'text');
  }

  public addShape(shape: string) {
    this.canvasManagerService.addGeometricShape(
      this.strokeColor,
      this.fillColor,
      AvailableGeometricShape[shape]
    );
  }

  public addImage(source: string) {
    this.canvasManagerService.addImage(this.iconsPath + source);
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

  public crop() {
    this.isCropping = true;
    this.canvasManagerService.disableSelection();
    this.canvasManagerService.addSelectionRectangle();
    this.isUndoAvailable = true;
    this.previousJson = this.canvasManagerService.jsonFromCanvas();
  }

  public deleteSelection() {
    this.canvasManagerService.deleteSelectedObjects();
  }

  public mouseUp(event) {
    if (this.isCropping) {
      this.isCropping = false;
      this.canvasManagerService.cropImage();
      this.isUndoAvailable = true;
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

  public undo() {
    this.canvasManagerService.loadfromJson(this.previousJson);
    this.isUndoAvailable = false; 
  }

  public onColorClicked() {
    this.isSelectingColor = true;
  }

  public setColor(color: string) {
    this.strokeColor = color;
    this.changeStrokeColor();
    this.isSelectingColor = false;
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

  public save() {
    this.computeJson();
    this.isUndoAvailable = false;
  }

  private computeJson() {
    this.currentJson = this.canvasManagerService.jsonFromCanvas();
    this.json.emit(JSON.stringify(this.currentJson));
  }
}
