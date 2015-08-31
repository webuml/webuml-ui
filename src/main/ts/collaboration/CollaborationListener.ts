/// <reference path="../global_typings/togetherjs.d.ts" />

import HighlightCommands = require('commands/HighlightCommands');
import CommandDispatcher = require('commands/CommandDispatcher');
import HighlightMsg = require('HighlightMsg');
import CanvasToolbox = require('canvas/CanvasToolbox');

export=CollaborationListener;

class CollaborationListener {

  "use strict";

  public static init(): void {
    TogetherJS.hub.on('app.webuml.highlight', (msg) => {
      if (msg.payload) {
        // TODO: clean-up user data !!!
        CollaborationListener.onReceived(msg.payload);
      }
    });
    TogetherJS.hub.on('webuml.highlight', (msg) => {
      if (msg.payload) {
        // TODO: clean-up user data !!!
        CollaborationListener.onReceived(msg.payload);
      }
    })
  }

  private static onReceived(data: HighlightMsg) {
    var canvas = CanvasToolbox.getInstance().getCanvas();

    var showCmd = new HighlightCommands.Show(canvas, data.left, data.top, data.width, data.height);
    CommandDispatcher.dispatch(showCmd);

    // TODO: this is a PoC hack, disable the highlighting ....
    setTimeout(function () {
      var hideCmd = new HighlightCommands.Hide(canvas);
      CommandDispatcher.dispatch(hideCmd)
    }, 3000);
  }
}
