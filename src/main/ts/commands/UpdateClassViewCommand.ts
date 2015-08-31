import Command = require('commands/Command');
import ClassView = require('domain/ClassView');
import HyperMediaDocument = require('../hal/HyperMediaDocument');
import profiles = require('../profiles');
import projectmanager = require("projectmanager/Client")

export class UpdateClassViewCommand implements Command.Command {

  private static projectManagerServiceDocument: HyperMediaDocument<void,void> = null;

  private classView: ClassView = null;

  constructor(classView: ClassView) {
    this.classView = classView;
  }

  public run() {
    this.lazyLoadServiceDocument(() => {
      this.updateClassView()
    });
  }

  public canUndo(): boolean {
    return false;
  }

  public undo() {
    // nothing to do here
  }

  private updateClassView() {
    var href = UpdateClassViewCommand.projectManagerServiceDocument.getHref(projectmanager.REL.CLASS_VIEW);
    href = href.replace("{classViewId}", this.classView.id.value);// TODO: hacky !!! -> should use URI expansion
    var classViewCopy = {
      x : this.classView.x,
      y : this.classView.y,
      z : this.classView.z,
      w : this.classView.w,
      h : this.classView.h,
      projectId : this.classView.projectId,
      classId : this.classView.classId,
      parent : this.classView.parent
    };

    function deferedSendUpdateToServer() {
      if (href) {
        var settings:JQueryAjaxSettings = {
          type : 'put',
          contentType : 'application/json',
          data : JSON.stringify(classViewCopy)
        };
        $.ajax(href, settings);
      }
    }

    window.clearTimeout(this.classView.__dirtyTimerHandle);
    this.classView.__dirtyTimerHandle = window.setTimeout(deferedSendUpdateToServer, 3000);
  }


  private lazyLoadServiceDocument(callback: ()=>void) {
    if (!UpdateClassViewCommand.projectManagerServiceDocument) {
      $.get(profiles.projectManagerBaseUri, jsonData => {
        UpdateClassViewCommand.projectManagerServiceDocument = new HyperMediaDocument<void, void>(jsonData);
        callback.apply(this);
      });
    } else {
      callback.apply(this);
    }
  }

}