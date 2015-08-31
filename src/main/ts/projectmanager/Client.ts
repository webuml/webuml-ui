/// <reference path="../global_typings/jquery/jquery.d.ts" />

import LightTableView = require('../domain/LightTableView');
import ClassView = require('../domain/ClassView');
import Association = require('../domain/metamodel/Association');
import Class = require('../domain/metamodel/Class');
import AssociationView = require('../domain/AssociationView');
import Thumbnail = require('../domain/Thumbnail');
import Links = require('../hal/Links');
import HyperMediaDocument = require('../hal/HyperMediaDocument');
import profiles = require('../profiles');
import LocationToolbox = require('window/LocationToolbox');

export = projectmanager;
module projectmanager {

  export class REL {
    static ASSOCIATION_VIEWS: string = 'http://projects.webuml.com/rel/associationViews';
    static CLASS_VIEWS: string = 'http://projects.webuml.com/rel/classViews';
    static CLASS_VIEW: string = 'http://projects.webuml.com/rel/classView';
    static THUMBNAIL: string = 'http://projects.webuml.com/rel/thumbnail';
  }

  export class Client {

    private lightTableViewDocument: HyperMediaDocument<LightTableView, void> = null;

    getLightTableView(callback: (lightTableView: LightTableView) => any) {
      var lightTableViewId = LocationToolbox.getLightTableViewIdFromPathName();
      var href = profiles.projectManagerBaseUri + "/lightTables/";
      if (lightTableViewId) {
        href += lightTableViewId;
      } else {
        href += "884711";
      }

      $.get(href, jsonData => {
        this.lightTableViewDocument = new HyperMediaDocument<LightTableView, void>(jsonData);
        callback(this.lightTableViewDocument.getData());
      });
    }

    getClassViews(callback: (classViews: ClassView[]) => any) {
      var href = this.lightTableViewDocument.getHref(REL.CLASS_VIEWS);
      if (href) {
        $.get(href, data => {
          // TODO (20140601 maki): where are the different childViewTypes ??? TypeDiscriminator
          callback(data._embedded.classViewList);
        })
      }
    }

    getAssociationViews(callback: (associationView: AssociationView[]) => any) {
      // TODO (20140628, maki): Handle "NO AssociationViews found"
      var href = this.lightTableViewDocument.getHref(REL.ASSOCIATION_VIEWS);
      if (href) {
        $.get(href, data => {
          // TODO (20140601 maki): where are the different childViewTypes ??? TypeDiscriminator
          callback(data._embedded.associationViewList);
        })
      }
    }

  }
}

