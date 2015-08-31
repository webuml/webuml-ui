export = FabricCanvasUpdater;

import Rectangle = require('../domain/Rectangle')

module FabricCanvasUpdater {

  export class CanvasUpdater {

    _callbacks = [];

    add(fn:(rectangle:Rectangle) => any) {
      this._callbacks.push(fn.bind(this));
    }

    update(rectangle:Rectangle) {
      for (var i = 0; i < this._callbacks.length; i++) {
        var fn = this._callbacks[i];
        fn(rectangle);
      }
    }
  }

}