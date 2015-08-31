import ProjectId = require('../ProjectId')
import ElementId = require('../ElementId')
import ElementView = require('../ElementView')
import ElementViewId = require('../ElementViewId')
import RectangleView = require('../RectangleView')
import ClassView = require('../ClassView')

export = Class;
class Class {

  projectId: ProjectId;
  name: string;
  view: ClassView;

  _links: any;  
}
