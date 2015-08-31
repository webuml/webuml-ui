
import Logger = require('Logger')
import BasicShapes = require('canvas/BasicShapes')
import Vec2 = require('canvas/Vec2')
import profiles = require('profiles')
import ClassViewCache = require('ClassViewCache')
import CanvasToolbox = require('canvas/CanvasToolbox')
import LocationToolbox = require('window/LocationToolbox')
import AjaxAnimation = require('window/AjaxAnimation')
import projectmanager = require("projectmanager/Client")
import ClassViewAndAssociationViewMap = require('projectmanager/ClassViewAndAssociationViewMap')
import ProjectId = require('domain/ProjectId');
import LightTableView = require('domain/LightTableView')
import ClassView = require('domain/ClassView')
import Point = require('domain/Point')
import Rectangle = require('domain/Rectangle')
import AssociationView = require('domain/AssociationView')
import Class = require('domain/metamodel/Class')
import Association = require('domain/metamodel/Association')
import KeyMapping = require('keybinding/KeyMapping')
import CommandDispatcher = require('commands/CommandDispatcher');
import PaintClassViewCommand = require('commands/PaintClassViewCommand');
import CollaborationListener = require('collaboration/CollaborationListener');

export = WebUml;
module WebUml {

  export class Application {

    private canvas: any;
    private basicShapes: BasicShapes = new BasicShapes();


    private client: projectmanager.Client = new projectmanager.Client();

    lightTableView: LightTableView;

    public constructor() {
      AjaxAnimation.registerGlobalAjaxEventsForAnimation();
      this.canvas = CanvasToolbox.getInstance().getCanvas();
      this.client.getLightTableView((view: LightTableView) => {
        this.lightTableView = view;
        this.onLightTableViewLoaded(view);
      });
      KeyMapping.init();
      CollaborationListener.init();
    }


    private onLightTableViewLoaded(lightTableView: LightTableView) {
      this.applyDocumentTitle(lightTableView.name);
      this.client.getClassViews((classViews: ClassView[]) => {
        this.onClassViewsLoaded(classViews);
        // there is a dependency, associations have to be loaded after classes :-/
        this.client.getAssociationViews((associationViews: AssociationView[]) => {
          this.onAssociationViewsLoaded(associationViews);
        });
      });
    }

    private applyDocumentTitle(name: string) {
      document.title = name + " | WebUml";
    }

    private onClassViewsLoaded(classViews: ClassView[]) {
      _.each(classViews, (classView: ClassView) => {
        var cmd = new PaintClassViewCommand.PaintClassViewCommand(this.lightTableView, classView);
        CommandDispatcher.dispatch(cmd);
      });
    }

    private onAssociationViewsLoaded(associationViews: AssociationView[]) {
      _.each(associationViews, (associationView: AssociationView) => {
        associationView.parentElement = this.lightTableView;
        ClassViewCache.resolve(associationView._links['http://projects.webuml.com/rel/association'], (currentAssociation: Association) => {
          this.onAssociationResolved(associationView, currentAssociation);
        })
      });
    }

    private onAssociationResolved(associationView: AssociationView, association: Association) {

      var memberTypes = [];
      var _application = this;

      function onMemberTypeResolved(memberType) {
        ClassViewAndAssociationViewMap.insert(memberType.view, associationView);
        memberTypes.push(memberType);
        if (memberTypes.length == 2) {
          _application.drawAssociation(associationView, memberTypes);
        }
      }

      function onPropertyResolved(property) {
        Logger.info("Resolved property id=" + property.id + " for memberEnd id=" + property.id);
        ClassViewCache.resolve(property._links['self'], (memberType) => {
          // hint: should already be cached ...
          onMemberTypeResolved(memberType)
        });
      }

      function onMemberEndResolved(memberEnd) {
        var link = memberEnd._links['http://projects.webuml.com/rel/type'];
        if (link) {
          ClassViewCache.resolve(link, onPropertyResolved);
        } else {
          Logger.info("Resolved memberEnd id=" + memberEnd.id + " -- but no relation for type exits.");
        }
      }

      association.view = associationView;

      ClassViewCache.resolve(association._links['http://projects.webuml.com/rel/memberEnd'][0], onMemberEndResolved);
      ClassViewCache.resolve(association._links['http://projects.webuml.com/rel/memberEnd'][1], onMemberEndResolved);
    }

    // TODO: Change to proper transformation
    private lightTableViewCoordinatesToFabricCoordinates(point) {
      return {x : point.x, y : point.y, z : point.z};
    }

    // TODO: Change to proper transformation
    private fabricCoordinatesToLightTableViewCoordinates(point) {
      return {x : point.x, y : point.y, z : point.z};
    }

    private calculateCenter(rect : Rectangle) : Point {
      return {
        x : rect.x + (Math.abs(rect.w) / 2),
        y : rect.y + (Math.abs(rect.h) / 2),
        z : rect.z
      }
    }

    private drawAssociation(associationView: AssociationView, memberTypes) {
      Logger.info("memberTypes =" + memberTypes);
      var p1 = this.calculateCenter(memberTypes[0].view);
      var p2 = this.calculateCenter(memberTypes[1].view);
      if (p1.x == p2.x && p1.y == p2.y) {
        this.drawAssociationSelfBezier(associationView, memberTypes);
      } else {
        this.drawAssociationLine(associationView, memberTypes);
      }
    }

    private drawAssociationSelfBezier(associationView: AssociationView,memberTypes) {
      var w = 0.75 * memberTypes[0].view.w;
      var h = 0.75 * memberTypes[0].view.h;
      var p1 = this.calculateCenter(memberTypes[0].view);

      // TODO (20140608, maki): use Coordinate-Transformation
      function toRectangleTopLeftCoord(point) {
        return {
          x : point.x,
          y : point.y - h
        }
      }

      var fabricRect = this.basicShapes.createSimpleRectangle(toRectangleTopLeftCoord(p1).y, toRectangleTopLeftCoord(p1).x, w, h);
      associationView.fabricModel = fabricRect;
      this.canvas.add(fabricRect);
      fabricRect.sendToBack();

      memberTypes[0].view.fabricModel.updateCanvas.add((rectangle: Rectangle) : any => {
        var midPoint = this.calculateCenter(rectangle);
        fabricRect.set({
          'top': toRectangleTopLeftCoord(midPoint).y,
          'left': toRectangleTopLeftCoord(midPoint).x
        });
      });
    }

    private drawAssociationLine(associationView: AssociationView, memberTypes) {
      var p1 = this.calculateCenter(memberTypes[0].view);
      var p2 = this.calculateCenter(memberTypes[1].view);

      var coords = [
        this.lightTableViewCoordinatesToFabricCoordinates({x : p1.x}).x,
        this.lightTableViewCoordinatesToFabricCoordinates({y : p1.y}).y,
        this.lightTableViewCoordinatesToFabricCoordinates({x : p2.x}).x,
        this.lightTableViewCoordinatesToFabricCoordinates({y : p2.y}).y
      ];
      var line = this.basicShapes.createLine(coords);
      associationView.fabricModel = line;
      this.canvas.add(line);
      line.sendToBack();

      memberTypes[0].view.fabricModel.updateCanvas.add((rectangle: Rectangle) : any => {
        var midPoint = this.calculateCenter(rectangle);
        line.set({'x1' : midPoint.x, 'y1' : midPoint.y});
      });

      memberTypes[1].view.fabricModel.updateCanvas.add((rectangle: Rectangle) : any => {
        var midPoint = this.calculateCenter(rectangle);
        line.set({'x2' : midPoint.x, 'y2' : midPoint.y});
      });
    }

  }

}
