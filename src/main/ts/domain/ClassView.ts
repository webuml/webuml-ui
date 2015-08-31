import ProjectId = require('ProjectId')
import ElementId = require('ElementId')
import ElementView = require('ElementView')
import ElementViewId = require('ElementViewId')
import RectangleView = require('RectangleView')
import Class = require('metamodel/Class')

export = ClassView;
class ClassView extends RectangleView {
  projectId: string;
  classId: string;
  clazz: Class;
  parent: ElementViewId;

  parentElement: ElementView;

  fabricModel: any;
  modelElement: ElementView;
  _links: any;
  __dirtyTimerHandle: number;
}
