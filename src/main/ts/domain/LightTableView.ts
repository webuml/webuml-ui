
import ElementView = require('ElementView')
import ProjectId = require('ProjectId')
import Point = require('Point')

export = LightTableView
class LightTableView extends ElementView implements Point {
  x: number;
  y: number;
  z: number;
  scale: number;
  name: string;
  projectId: ProjectId;
}
