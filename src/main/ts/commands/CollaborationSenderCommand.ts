/// <reference path="../global_typings/togetherjs.d.ts" />

import Command = require('commands/Command');

export class CollaborationSenderCommand implements Command.Command {

  "use strict";

  private left: number;
  private top: number;
  private width: number;
  private height: number;

  constructor(left: number, top: number, width: number, height: number) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  public run() {
    if (TogetherJS.running) {
      TogetherJS.send({type : "webuml.highlight", payload : {
        left : this.left,
        top : this.top,
        width : this.width,
        height : this.height
      }})
    }
  }

  public canUndo(): boolean {
    return false;
  }

  public undo() {
    // nothing to do here
  }

}
