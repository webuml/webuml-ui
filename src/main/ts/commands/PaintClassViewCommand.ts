import BasicShapes = require('canvas/BasicShapes')
import Command = require('commands/Command');
import UpdateLightTableThumbnailCommand = require('commands/UpdateLightTableThumbnailCommand')
import UpdateClassViewCommand = require('commands/UpdateClassViewCommand')
import CommandDispatcher = require('commands/CommandDispatcher');
import ClassView = require('domain/ClassView');
import ElementView = require('domain/ElementView');
import Class = require('domain/metamodel/Class');
import LightTableView = require('domain/LightTableView')
import Rectangle = require('domain/Rectangle')
import ClassViewCache = require('../ClassViewCache')
import projectmanager = require("projectmanager/Client")
import FabricCanvasUpdater = require('canvas/FabricCanvasUpdater')
import CanvasToolbox = require('canvas/CanvasToolbox')

export class PaintClassViewCommand implements Command.Command {

  private lightTableView: ElementView = null;
  private classView: ClassView = null;

  private canvas: any;
  private basicShapes: BasicShapes = new BasicShapes();
  private element_icon_class_016: any = document.getElementById('icon_class-016.png');

  constructor(lightTableView: ElementView, classView: ClassView) {
    this.lightTableView = lightTableView;
    this.classView = classView;
    this.classView.parentElement = this.lightTableView;
    this.canvas = CanvasToolbox.getInstance().getCanvas();
  }

  public run() {
    ClassViewCache.resolve(this.classView._links['http://projects.webuml.com/rel/class'], (currentClass: Class) => {
      this.onClassResolved(this.classView, currentClass);
    });
  }

  public canUndo(): boolean {
    return false;
  }

  public undo() {
    // nothing to do here
  }

  private onClassResolved(classView: ClassView, classModel: Class) {
    classView.clazz = classModel;
    classModel.view = classView;

    var name = classModel.name;
    var left = this.lightTableViewCoordinatesToFabricCoordinates({x : classView.x}).x;
    var top = this.lightTableViewCoordinatesToFabricCoordinates({y : classView.y}).y;
    // TODO: hacky! how do we build bidirectional navigation?
    classView.fabricModel = this.drawClassRectangle(top, left, name, classView.w, classView.h);
    classView.fabricModel.modelElement = classView;
    classView.fabricModel.updateCanvas = new FabricCanvasUpdater.CanvasUpdater();
    classView.fabricModel.updateCanvas.add((rectangle: Rectangle): any => {
      this.updateClassViewModelOnServer(classView, rectangle);
    });
    classView.fabricModel.updateCanvas.add((rectangle: Rectangle): any => {
      var cmd = new UpdateLightTableThumbnailCommand.UpdateLightTableThumbnailCommand(classView.parentElement, this.canvas.getElement());
      CommandDispatcher.dispatch(cmd);
    });
  }

  private updateClassViewModelOnServer(classView: ClassView, rectangle: Rectangle) {
    classView.x = rectangle.x;
    classView.y = rectangle.y;
    var cmd = new UpdateClassViewCommand.UpdateClassViewCommand(classView);
    CommandDispatcher.dispatch(cmd);
  }

  // TODO: Change to proper transformation
  private lightTableViewCoordinatesToFabricCoordinates(point) {
    return {x : point.x, y : point.y, z : point.z};
  }

  // TODO: Change to proper transformation
  private fabricCoordinatesToLightTableViewCoordinates(point) {
    return {x : point.x, y : point.y, z : point.z};
  }

  private drawClassRectangle(top, left, name, w, h) {
    var fabricClass = this.createClassView(name, top, left, w, h);
    this.canvas.add(fabricClass);
    return fabricClass;
  }

  private createClassView(name, top, left, w, h) {
    var rect = this.basicShapes.createRectangle(top, left, w, h);
    var img = new fabric.Image(this.element_icon_class_016, {top : top + 5, left : left + 5});
    var text = this.basicShapes.createText(top + 5, left + 30, name);
    return new fabric.Group([rect, img, text], {
      left : left,
      top : top
    });
  }

}