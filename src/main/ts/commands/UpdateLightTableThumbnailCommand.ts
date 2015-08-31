import Command = require('Command');
import LightTableView = require('domain/LightTableView')
import ElementView = require('domain/ElementView')
import Thumbnail = require('domain/Thumbnail');
import HyperMediaDocument = require('../hal/HyperMediaDocument');
import profiles = require('../profiles');
import projectmanager = require("projectmanager/Client")
import Canvas2Image = require('canvas/Canvas2Image');

export class UpdateLightTableThumbnailCommand implements Command.Command {

  private static projectManagerServiceDocument: HyperMediaDocument<void,void> = null;
  private static dirtyTimerHandle : number;

  private lightTableView: ElementView = null;
  private canvas: any = null;

  constructor(lightTableView: ElementView, canvas: any) {
    this.lightTableView = lightTableView;
    this.canvas = canvas;
  }

  public run() {
    this.lazyLoadServiceDocument(() => {
      this.updateLightTableThumbnail()
    });
  }

  public canUndo(): boolean {
    return false;
  }

  public undo() {
    // nothing to do here
  }

  private updateLightTableThumbnail() {
    var thumbnail = new Thumbnail(this.lightTableView.id);
    var href = UpdateLightTableThumbnailCommand.projectManagerServiceDocument.getHref(projectmanager.REL.THUMBNAIL);
    href = href.replace("{lightTableViewId}", this.lightTableView.id.value); // TODO: hacky !!! -> should use URI expansion

    // TODO (20140618, maki): Unsafe solution! Think about to use RxJS
    function deferedSendUpdateToServer() {
      thumbnail.imageData = new Canvas2Image().saveAsJPEG(this.canvas, false, 128, 96);
      thumbnail.title = this.lightTableView.name;
      if (href) {
        var settings: JQueryAjaxSettings = {
          type : 'put',
          contentType : 'application/json',
          data : JSON.stringify(thumbnail)
        };
        $.ajax(href, settings);
      }
    }

    window.clearTimeout(UpdateLightTableThumbnailCommand.dirtyTimerHandle);
    UpdateLightTableThumbnailCommand.dirtyTimerHandle = window.setTimeout(deferedSendUpdateToServer.bind(this), 3000);
  }

  private lazyLoadServiceDocument(callback: ()=>void) {
    if (!UpdateLightTableThumbnailCommand.projectManagerServiceDocument) {
      $.get(profiles.projectManagerBaseUri, jsonData => {
        UpdateLightTableThumbnailCommand.projectManagerServiceDocument = new HyperMediaDocument<void, void>(jsonData);
        callback.apply(this);
      });
    } else {
      callback.apply(this);
    }
  }

}