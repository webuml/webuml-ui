export=HighlightingHolder;

/**
 * It's a FIFO implementation
 */
class HighlightingHolder {

  "use strict";

  private static highlight = [];

  public static push(highlight: any) {

    HighlightingHolder.highlight.push(highlight);
  }

  public static pop(): any {
    var obj = HighlightingHolder.peek();
    if (obj) {
      HighlightingHolder.highlight = HighlightingHolder.highlight.slice(1);
    }
    return obj;
  }

  public static peek(): any {
    if (HighlightingHolder.highlight.length > 0) {
      return HighlightingHolder.highlight[0];
    }
    return null;
  }
}
