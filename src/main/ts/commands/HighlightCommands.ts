import Command = require('commands/Command');
import CommandDispatcher = require('commands/CommandDispatcher');
import HighlightingHolder = require('collaboration/HighlightingHolder');
import CanvasToolbox = require('canvas/CanvasToolbox');

export class Show implements Command.Command {

  "use strict";

  private left: number;
  private top: number;
  private width: number;
  private height: number;
  private canvas: any;

  constructor(canvas: any, left: number, top: number, width: number, height: number) {
    this.canvas = canvas;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  public run() {
    var highlightRect = new fabric.Rect({
      selectable: false,
      top : this.top - 2.5,
      left : this.left - 2.5,
      width : this.width,
      height : this.height,
      stroke : 'rgba(255,0,0,0.6)',
      strokeWidth : 5,
      fill : 'transparent',
      rx : 3,
      ry : 3
    });
    HighlightingHolder.push(highlightRect);
    this.canvas.add(highlightRect);
    highlightRect.sendBackwards(true);
    this.canvas.renderAll();
  }

  public canUndo(): boolean {
    return false;
  }

  public undo() {
    // nothing to do here
  }
}

export class Hide implements Command.Command {

  "use strict";

  private canvas: any;

  constructor(canvas: any) {
    this.canvas = canvas;
  }

  public run() {
    if (HighlightingHolder.peek()) {
      this.canvas.remove(HighlightingHolder.pop());
      this.canvas.renderAll();
    }
  }

  public canUndo(): boolean {
    return false;
  }

  public undo() {
    // nothing to do here
  }

}