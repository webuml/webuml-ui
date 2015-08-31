import ProjectId = require('../ProjectId')
import ElementId = require('../ElementId')
import Entity = require('../Entity')
import ElementView = require('../ElementView')
import ElementViewId = require('../ElementViewId')
import RectangleView = require('../RectangleView')
import ClassView = require('../ClassView')

export = Classifier;
class Classifier implements Entity<ElementId>{

  getId(): ElementId {
    return undefined;
  }

  projectId: ProjectId;
  name: string;

}
