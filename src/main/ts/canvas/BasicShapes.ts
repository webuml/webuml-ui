/// <reference path="../global_typings/fabricjs/fabricjs.d.ts" />

export = BasicShapes;

class BasicShapes {

  "use strict";

  private standardWidth:number;
  private standardHeight:number;

  public constructor(standardWidth:number = 100, standardHeight:number = 80) {
    this.standardWidth = standardWidth;
    this.standardHeight = standardHeight;
  }

  public createText(top, left, text) {
    text = text || '?';
    left = left || 0;
    return new fabric.Text(text, {
      left: left,
      top: top,
      fill: '#444',
      fontSize: 12,
      fontFamily: "sans-serif"
    });
  }

  public createRectangle(top, left, w, h) {
    // for classes only !!!
    left = left || 100;
    top = top || 150;
    w = w || this.standardWidth;
    h = h || this.standardHeight;
    return new fabric.Rect({
      fill: '#fff',
      width: w,
      height: h,
      top: top,
      left: left,
      stroke: '#666666',
      strokeWidth: 2,
      padding: 3,
      rx: 3,
      ry: 3,
      shadow: {
        color: 'rgba(0,0,0,0.6)',
        blur: 10,
        offsetX: 3,
        offsetY: 2,
        opacity: 0.6,
        fillShadow: true,
        strokeShadow: true
      }
    });
  }

  public createSimpleRectangle(top:number, left:number, w:number, h:number) {
    // for self association only !!!
    left = left || 100;
    top = top || 150;
    w = w || this.standardWidth;
    h = h || this.standardHeight;
    return new fabric.Rect({
      fill: '',
      selectable: false,
      width: w,
      height: h,
      top: top,
      left: left,
      stroke: '#666666',
      strokeWidth: 3,
      padding: 3,
      rx: 1,
      ry: 1
    });
  }

  public createLine(coords) {
    return new fabric.Line(
        coords, {
          fill: '#777777',
          stroke: '#666666',
          strokeWidth: 3,
          selectable: false
        });
  }

}

