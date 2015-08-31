import ProjectId = require('domain/ProjectId')
import ElementViewId = require('domain/ElementViewId')
import ElementView = require('domain/ElementView')
import ElementId = require('domain/ElementId')
import Rectangle = require('domain/Rectangle')

export = Thumbnail;
class Thumbnail extends ElementView {

  public lightTableViewId: ElementViewId;
  public imageData: string;
  public title: string;

  constructor(lightTableViewId: ElementViewId) {
    super();
    this.lightTableViewId = lightTableViewId;
  }
}
