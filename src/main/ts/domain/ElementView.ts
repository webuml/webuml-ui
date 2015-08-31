import ElementViewId = require('ElementViewId');
import Entity = require('Entity');

export = ElementView;

class ElementView implements Entity<ElementViewId> {

  id:any;

  getId(): ElementViewId {
    return this.id;
  }

}


