import ProjectId = require('ProjectId')
import ElementViewId = require('ElementViewId')
import ElementView = require('ElementView')
import ElementId = require('ElementId')
import Rectangle = require('Rectangle')

export = RectangleView;
class RectangleView extends ElementView implements Rectangle {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  projectId: string;
  classId: string;
  parent: ElementViewId;
}
