import { TestBed, inject, async } from '@angular/core/testing';
import { CanvasManagerService,  AvailableGeometricShape } from './canvas-manager.service';
import { fabric } from 'fabric';

const testImageURL =
  'http://cdn3-www.dogtime.com/assets/uploads/gallery/pug-dog-breed-pictures/3-sidesitting.jpg';
const black = '#000000';

describe('ImageEditionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasManagerService]
    });
  });

  it('should be created', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should empty canvas', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.addGeometricShape(
        black,
        black,
        AvailableGeometricShape.Rectangle
      );
      service.emptyCanvas();
      expect(service.canvasObjects).toEqual([]);
    }
  ));

  it('should set image as background', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.setBackgroundFromURL(testImageURL, 1).then(() => {
        expect(service.canvasBackgroundImage != null);
      });
    }
  ));

  it('should add an image to canvas', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.addImage(testImageURL).then(() => {
        expect(service.canvasObjects.length).toBe(1);
      });
    }
  ));

  it('should add geometric shapes to image', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.addGeometricShape(black, black, AvailableGeometricShape.Triangle);
      expect(service.canvasObjects.length).toBe(1);
    }
  ));

  it('should add text to image', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.addText(black, 'test');
      expect(service.canvasObjects[0].type).toBe('i-text');
      expect(service.canvasObjects.length).toBe(1);
    }
  ));

  it('should bring selected objects to front', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.addGeometricShape(black, black, AvailableGeometricShape.Circle);
      service.addText(black, 'test');
      service.selectItem(0);
      const activeObject = service.activeObject;
      const firstIndex = service.getIndexOf(activeObject);
      service.bringSelectedObjectsToFront();
      const secondIndex = service.getIndexOf(activeObject);

      expect(firstIndex).toBeLessThan(secondIndex);
    }
  ));

  it('should send selected objects to back', inject(
    [CanvasManagerService],
    (service: CanvasManagerService) => {
      service.addGeometricShape(
        black,
        black,
        AvailableGeometricShape.Rectangle
      );
      service.addText(black, 'test');
      service.selectItem(1);
      const activeObject = service.activeObject;
      const firstIndex = service.getIndexOf(activeObject);
      service.sendSelectedObjectsToBack();
      const secondIndex = service.getIndexOf(activeObject);

      expect(firstIndex).toBeGreaterThan(secondIndex);
    }
  ));
});
