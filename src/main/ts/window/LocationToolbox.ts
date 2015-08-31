export=LocationToolbox;

class LocationToolbox {

  "use strict";

  public static getProjectIdFromPathName() {
    var match = /\/projects\/([-A-Z0-9a-z]+)/.exec(location.pathname);
    return match == null ? "" : match[1];
  }

  public static getLightTableViewIdFromPathName() {
    var match = /\/lightTables\/([-A-Z0-9a-z]+)/.exec(location.pathname);
    return match == null ? "" : match[1];
  }
}
