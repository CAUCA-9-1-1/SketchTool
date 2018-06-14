import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

export enum AvailableGeometricShape {
  'Rectangle',
  'Circle',
  'Triangle',
  'Line',
  'Cross'
}

const SHAPE_DATA = {
  width: 50,
  height: 50,
  left: 50,
  top: 50,
  radius: 25,
  stroke: 3,
  freeDrawingBrushWidth: 10,

};

@Injectable()
export class CanvasManagerService {
  private canvas;
  private cropRectangle: fabric.Rect;
  private mouse: number[];
  private pos: number[];

  constructor() {
    this.emptyCanvas();
    this.mouse = [0, 0];
    this.pos = [0, 0];
  }

  public emptyCanvas(): void {
    if (this.canvas) {
      this.canvas.dispose();
    }
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.clear();
    this.canvas.remove(this.canvas.getObjects());
  }

  public loadNewImage(backgroundImageURL?: string): void {
    this.emptyCanvas();
    if (backgroundImageURL) {
      this.setBackgroundFromURL(backgroundImageURL, 1);
    }
  }

  public renderCanvas(): void {
    this.markSelectedObjectsDirty();
    this.canvas.renderAll();
  }

  public addGeometricShape(
    strokeColor: string,
    fillColor: string,
    shape: AvailableGeometricShape
  ): void {
    switch (shape) {
      case AvailableGeometricShape.Rectangle:
        this.addRectangle(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Circle:
        this.addCircle(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Triangle:
        this.addTriangle(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Line:
        this.addHorizontalLine(strokeColor, fillColor);
        break;
      case AvailableGeometricShape.Cross:
        this.addCross(strokeColor, fillColor);
        break;
    }
  }

  private addRectangle(strokeColor: string, fillColor: string): void {
    this.canvas.add(
      new fabric.Rect({
        width: SHAPE_DATA.width,
        height: SHAPE_DATA.height,
        left: SHAPE_DATA.left,
        top: SHAPE_DATA.top,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: SHAPE_DATA.stroke
      })
    );
  }

  private addCircle(strokeColor: string, fillColor: string): void {
    this.canvas.add(
      new fabric.Circle({
        left: SHAPE_DATA.left,
        top: SHAPE_DATA.top,
        radius: SHAPE_DATA.radius,
        stroke: strokeColor,
        strokeWidth: SHAPE_DATA.stroke,
        fill: fillColor
      })
    );
  }

  private addTriangle(strokeColor: string, fillColor: string): void {
    this.canvas.add(
      new fabric.Triangle({
        width: SHAPE_DATA.width,
        height: SHAPE_DATA.height,
        left: SHAPE_DATA.left,
        top: SHAPE_DATA.top,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: SHAPE_DATA.stroke
      })
    );
  }

  private addHorizontalLine(strokeColor: string, fillColor: string): void {
    this.canvas.add(this.createHorizontalLine(strokeColor));
  }

  private createHorizontalLine(strokeColor: string): fabric.Line {
    const line = new fabric.Line([100, 150, 200, 150], {
      left: 50,
      top: 100,
      stroke: strokeColor,
      strokeWidth: 5
    });

    line.setControlsVisibility({
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mt: false,
      mb: false
    });

    return line;
  }

  private createVerticalLine(strokeColor: string): fabric.Line {
    const line = new fabric.Line([150, 100, 150, 200], {
      left: 100,
      top: 50,
      stroke: strokeColor,
      strokeWidth: 5
    });

    line.setControlsVisibility({
      bl: false,
      br: false,
      tl: false,
      tr: false,
      ml: false,
      mr: false
    });

    return line;
  }

  private addCross(strokeColor: string, fillColor: string): void {
    const horizontalLine = this.createHorizontalLine(strokeColor);
    const verticalLine = this.createVerticalLine(strokeColor);
    this.canvas.add(horizontalLine);
    this.canvas.add(verticalLine);
  }

  public toggleFreeDrawing(): void {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }

  public setFreeDrawingBrushColor(color: string): void {
    this.canvas.freeDrawingBrush.color = color;
    this.canvas.freeDrawingBrush.width = SHAPE_DATA.freeDrawingBrushWidth;
  }

  public addText(color: string, inputText: string): void {
    const text = new fabric.IText(inputText, {
      fontFamily: 'arial black',
      fontStyle: 'bold',
      left: SHAPE_DATA.left,
      top: SHAPE_DATA.top
    });

    text.setColor(color);

    this.canvas.add(text);
    this.selectLastObject();
  }

  public addImage(imageURL: string): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        const canvas = this.canvas;

        const image = new Image();
        image.onload = function(img) {
          const fabricImage = new fabric.Image(image, {
            angle: 0,
            width: image.width,
            height: image.height,
            left: SHAPE_DATA.left,
            top: SHAPE_DATA.top,
            scaleX: 1,
            scaleY: 1
          });
          canvas.add(fabricImage);
          resolve();
        };
        image.src = imageURL;
      }
    );
  }

  public setBackgroundFromURL(
    backgroundImageURL: string,
    scale: number
  ): Promise<void> {
    const canvas = this.canvas;

    return new Promise(
      (resolve, reject): void => {
        const image = new Image();
        image.onload = function(img) {
          const fabricImage = new fabric.Image(image, {});
          canvas.setWidth(fabricImage.width * scale);
          canvas.setHeight(fabricImage.height * scale);
        };
        image.src = backgroundImageURL;

        this.canvas.setBackgroundImage(
          backgroundImageURL,
          this.canvas.renderAll.bind(this.canvas),
          {
            backgroundImageStretch: false,
            scaleX: scale,
            scaleY: scale
          }
        );
        resolve();
      }
    );
  }

  public changeSelectedObjectsFillColor(color: string): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        object.setColor(color);
        this.canvas.renderAll();
      }
    }
  }

  public changeSelectedObjectsStrokeColor(color: string): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        if (object.type === 'i-text') {
          object.setColor(color);
        } else {
          object.stroke = color;
          object.set('dirty', true);
        }
      }
      this.canvas.renderAll();
    }
  }

  public deleteSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        this.canvas.remove(object);
      }
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
  }

  public bringSelectedObjectsToFront(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        this.canvas.bringToFront(object);
      }
    }
  }

  public sendSelectedObjectsToBack(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        this.canvas.sendToBack(object);
      }
    }
  }

  public exportImageAsDataURL(): string {
    return this.canvas.toDataURL('image/png');
  }

  public get canvasObjects(): [fabric.Object] {
    return this.canvas.getObjects();
  }

  public get canvasBackgroundImage(): fabric.Image {
    return this.canvas.backgroundImage;
  }

  public selectItem(itemNumber: number): void {
    this.canvas.setActiveObject(this.canvas.item(itemNumber));
  }

  public get activeObject(): fabric.Object {
    return this.canvas.getActiveObject();
  }

  public getIndexOf(activeObject): number {
    return this.canvas.getObjects().indexOf(activeObject);
  }

  public jsonFromCanvas(): string {
    return this.canvas.toJSON();
  }

  public loadfromJson(json: string): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas));
        resolve();
      }
    );
  }

  private selectLastObject(): void {
    const itemNumber = this.canvas.getObjects().length - 1;
    const object = this.canvas.item(itemNumber);
    this.canvas.setActiveObject(object);
    object.enterEditing();
  }

  private markSelectedObjectsDirty(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      for (const object of activeObjects) {
        object.set('dirty', true);
      }
    }
  }

  public unselectAndReselectObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      this.canvas.discardActiveObject();

      const sel = new fabric.ActiveSelection(activeObjects, this.canvas);
      this.canvas.setActiveObject(sel);
      this.canvas.requestRenderAll();
    }
  }

  public addSelectionRectangle(): void {
    this.cropRectangle = new fabric.Rect({
      fill: 'transparent',
      originX: 'left',
      originY: 'top',
      stroke: '#ccc',
      strokeDashArray: [2, 2],
      opacity: 1,
      width: 1,
      height: 1
    });

    this.cropRectangle.visible = false;
    this.canvas.add(this.cropRectangle);
  }

  public cropImage(): void {
    const left = this.cropRectangle.left;
    const top = this.cropRectangle.top;

    this.moveAllObjectsInCanvas(-1 * left, -1 * top);

    const width = this.cropRectangle.width;
    const height = this.cropRectangle.height;

    this.canvas.backgroundImage.left -= left;
    this.canvas.backgroundImage.top -= top;

    this.canvas.setWidth(width);
    this.canvas.setHeight(height);

    this.canvas.selectable = true;
    this.canvas.selection = true;
    this.cropRectangle.visible = false;

    this.canvas.remove(this.cropRectangle);

    this.canvas.renderAll();
  }

  public ajustCropRectangle(event: MouseEvent): boolean {
    const x = Math.min(event.layerX, this.mouse[0]),
      y = Math.min(event.layerY, this.mouse[1]),
      w = Math.abs(event.layerX - this.mouse[0]),
      h = Math.abs(event.layerY - this.mouse[1]);

    if (!w || !h) {
      return false;
    }

    this.cropRectangle
      .set('top', y)
      .set('left', x)
      .set('width', w)
      .set('height', h);

    this.canvas.renderAll();

    return true;
  }

  public startSelectingCropRectangle(event: MouseEvent): void {
    this.pos[0] = this.canvas.left;
    this.pos[1] = this.canvas.top;

    this.cropRectangle.left = event.layerX;
    this.cropRectangle.top = event.layerY;
    this.cropRectangle.setCoords();

    this.mouse[0] = event.layerX;
    this.mouse[1] = event.layerY;

    this.canvas.renderAll();
    this.cropRectangle.visible = true;
    this.canvas.bringToFront(this.cropRectangle);
  }

  public disableSelection() {
    this.canvas.selection = false;
  }

  private moveAllObjectsInCanvas(x: number, y: number): void {
    const objects = this.canvas.getObjects();
    for (const obj of objects) {
      obj.left += x;
      obj.top += y;
      obj.setCoords();
    }
  }

  public groupSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();

    if (activeObjects) {
      const objects = [];

      for (const object of activeObjects) {
        objects.push(object);
      }
      this.deleteSelectedObjects();

      const group = new fabric.Group(objects);
      this.canvas.add(group);
      group.setCoords();

      this.canvas.setActiveObject(group);

      this.canvas.renderAll();
    }
  }
}

// Maintain stroke width when scaling objects
fabric.Object.prototype.render = function(ctx) {
  if (!this.stroke || this.strokeWidth === 0) {
    return;
  }
  if (this.shadow && !this.shadow.affectStroke) {
    this._removeShadow(ctx);
  }
  ctx.save();
  ctx.scale(1 / this.scaleX, 1 / this.scaleY);
  this._setLineDash(ctx, this.strokeDashArray, this._renderDashedStroke);
  this._applyPatternGradientTransform(ctx, this.stroke);
  ctx.stroke();
  ctx.restore();
};
