import SelectionHolder = require('keybinding/SelectionHolder');

import Command = require('Command');
import ClassView = require('domain/ClassView');
import AssociationView = require('domain/AssociationView');
import Association = require('domain/metamodel/Association');
import CanvasToolbox = require('canvas/CanvasToolbox');
import repository = require('../ClassViewCache');
import ClassViewAndAssociationViewMap = require('projectmanager/ClassViewAndAssociationViewMap');
import CommandDispatcher = require('commands/CommandDispatcher');
import CreateClassViewCommand = require('commands/CreateClassViewCommand');
import PaintClassViewCommand = require('commands/PaintClassViewCommand');

interface FabricModelElement {
  modelElement:ClassView;
  remove:()=>any;
}

export class DeleteCommand implements Command.Command {

  private classViewToUndo:ClassView;

  public run() {
    var selection = SelectionHolder.currentSelection.get();
    _.each(selection, (element:FabricModelElement) => {
      this.classViewToUndo = element.modelElement;
      this.deleteClassViewOnServer(element.modelElement);
      this.deleteFabricObjectOnCanvas(element);
      this.deleteAssociationViews(element.modelElement)
    });
  }

  public canUndo() {
    return (typeof this.classViewToUndo != 'undefined')
  }

  public undo() {
    var lightTableView = this.classViewToUndo.parentElement;
    var createClassView = CreateClassViewCommand.CreateClassViewCommand.cloneFrom(this.classViewToUndo, (classView:ClassView) => {
      var paintClassView = new PaintClassViewCommand.PaintClassViewCommand(lightTableView, classView);
      CommandDispatcher.dispatch(paintClassView);
    });
    CommandDispatcher.dispatch(createClassView);
  }

  private deleteAssociationViews(classView:ClassView) {
    var associationViews = ClassViewAndAssociationViewMap.getAssociationViewsFor(classView);
    ClassViewAndAssociationViewMap.removeClassView(classView);
    _.each(associationViews, (associationView:AssociationView) => {
      this.deleteAssociationView(associationView);
    })
  }

  private deleteAssociationView(associationView:AssociationView) {
    var href = associationView._links.self.href;
    $.ajax({
      url: href,
      type: 'delete'
    });
    var canvas = CanvasToolbox.getInstance().getCanvas();
    canvas.remove(associationView.fabricModel);
  }

  private deleteClassViewOnServer(modelElement:ClassView) {
    var href = modelElement._links.self.href;
    $.ajax({
      url: href,
      type: 'delete'
    });
  }

  private deleteFabricObjectOnCanvas(element:FabricModelElement) {
    var canvas = CanvasToolbox.getInstance().getCanvas();
    canvas.discardActiveObject();
    canvas.discardActiveGroup();
    canvas.remove(element);
  }
}