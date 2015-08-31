import ProjectId = require('ProjectId')
import ElementId = require('ElementId')
import ElementView = require('ElementView')
import ElementViewId = require('ElementViewId')
import RectangleView = require('RectangleView')
import PathRoutingStrategy = require('PathRoutingStrategy')
import Class = require('metamodel/Class')

export = AssociationView;
class AssociationView extends ElementView {
  projectId: ProjectId;
  association: ElementId;
  parent: ElementViewId;
  parentElement: ElementView;
  routing: PathRoutingStrategy;

  fabricModel: any;
  _links: any;
}
