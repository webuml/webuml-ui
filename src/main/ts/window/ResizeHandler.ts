export = ResizeHandler;

class ResizeHandler {

  "use strict";

  private windowResizeHandlers = [];
  private borderWidth: number = 20;

  constructor() {
    $(window).bind("resize", () => {
      this.fireAllHandlers();
    });
  }

  public addWindowResizeHandler(windowResizeHandler) {
    if (windowResizeHandler) {
      this.windowResizeHandlers.push(windowResizeHandler);
      this.fireHandler(windowResizeHandler);
    }
  }

  private fireAllHandlers() {
    for (var i = 0; i < this.windowResizeHandlers.length; i++) {
      var windowResizeHandler = this.windowResizeHandlers[i];
      this.fireHandler(windowResizeHandler);
    }
  }

  private fireHandler(windowResizeHandler) {
    var w = $(window).width() - this.borderWidth;
    var h = $(window).height() - this.borderWidth;
    try {
      windowResizeHandler(w, h);
    } catch (e) {
      if (console && console.error) {
        console.error("ERROR: " + e);
      }
    }
  }

}
