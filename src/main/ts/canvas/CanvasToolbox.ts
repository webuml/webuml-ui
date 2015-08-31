/// <reference path="../global_typings/fabricjs/fabricjs.d.ts" />

export = CanvasToolbox;

import ResizeHandler = require('window/ResizeHandler');
import SelectionHolder = require('keybinding/SelectionHolder');

import HighlightCommands = require('commands/HighlightCommands');
import CollaborationSenderCommand = require('commands/CollaborationSenderCommand');
import CommandDispatcher = require('commands/CommandDispatcher');

class CanvasToolbox {

  "use strict";

  private static instance: CanvasToolbox = null;

  private defaultWidth: number = 300;
  private defaultHeight: number = 200;

  private canvas: any;

  private activateCopySelectionIntoSelectionHolder() {
    this.canvas.on('selection:created', (e: any) => {
      SelectionHolder.currentSelection.set(e.target.getObjects());
    });
    this.canvas.on('selection:cleared', (e: any) => {
      SelectionHolder.currentSelection.set([]);
    });
    this.canvas.on('object:selected', (e: any) => {
      SelectionHolder.currentSelection.set([e.target]);
    });
  }

  private animateZoomEffectWhileHover(e, dir) {
    if (e.target && e.target.selectable) {
      fabric.util.animate({
        startValue : e.target.get('scaleX'),
        endValue : (dir ? 1.2 : 1),
        duration : 100,
        onChange : (value) => {
          e.target.scale(value);
          this.canvas.renderAll();
        },
        onComplete : function () {
          e.target.setCoords();
        }
      });
    }
  }

  private activateMouseMoveAnimation() {
    this.canvas.on('mouse:down', (e: any) => {
      this.animateZoomEffectWhileHover(e, 1);
    });
    this.canvas.on('mouse:up', (e: any) => {
      this.animateZoomEffectWhileHover(e, 0);
    });
  }

  private activateBringElementToFrontWhenClick() {
    this.canvas.on('mouse:down', function (e) {
      if (e.target && e.target.selectable) {
        e.target.bringToFront();
      }
    });
  }

  private activateHighlightingOnMouseOver() {
    this.canvas.on('mouse:over', (e)=> {
      if (e.target.type === 'group') {
        var rect = e.target.getBoundingRect();
        var notifyPeers = new CollaborationSenderCommand.CollaborationSenderCommand(rect.left, rect.top, rect.width, rect.height);
        var showCmd = new HighlightCommands.Show(this.canvas, rect.left, rect.top, rect.width, rect.height);
        CommandDispatcher.dispatch(notifyPeers);
        CommandDispatcher.dispatch(showCmd);
      }
    });

    this.canvas.on('mouse:out', (e)=> {
      if (e.target.type === 'group') {
        var hideCmd = new HighlightCommands.Hide(this.canvas);
        CommandDispatcher.dispatch(hideCmd);
      }
    });
  }

  private activateRepaintLinesWhileMouseMoving() {
    this.canvas.on('object:moving', function (e) {
      if (e.target) {
        var target = e.target;
        if (target.updateCanvas) {
          var x = target.left;
          var y = target.top;
          var w = target.width;
          var h = target.height;
          target.updateCanvas.update({ x : x, y : y, w : w, h : h });
        }
      }
    });
  }

  private adjustCanvasDimension(width, height) {
    if (this.canvas) {
      var w = width || this.defaultWidth;
      var h = height || this.defaultHeight;
      this.canvas.setDimensions({width : w, height : h});
    }
  }

  public getCanvas() {
    if (!this.canvas) {
      this.canvas = new fabric.Canvas('webuml-main-view-canvas', {
        width : $(window).width(),
        height : $(window).height()
      });
      this.canvas.hoverCursor = 'pointer';
      new ResizeHandler().addWindowResizeHandler(this.adjustCanvasDimension.bind(this));
      this.activateMouseMoveAnimation();
      this.activateBringElementToFrontWhenClick();
      this.activateRepaintLinesWhileMouseMoving();
      this.activateCopySelectionIntoSelectionHolder();
      this.activateHighlightingOnMouseOver();
    }
    return this.canvas;
  }

  public static getInstance(): CanvasToolbox {
    if (CanvasToolbox.instance == null) {
      CanvasToolbox.instance = new CanvasToolbox();
    }
    return CanvasToolbox.instance;
  }
}