import Command = require('Command');
import ClassView = require('domain/ClassView');
import ElementId = require('domain/ElementId');
import ElementView = require('domain/ElementView');
import HyperMediaDocument = require('../hal/HyperMediaDocument');
import profiles = require('../profiles');
import LocationToolbox = require('window/LocationToolbox');
import projectmanager = require('projectmanager/Client');

export interface ClassViewCreatedCallback {
  (classView: ClassView):any;
}

export class CreateClassViewCommand implements Command.Command {

  private static projectManagerServiceDocument: HyperMediaDocument<void,void> = null;

  private classView: ClassView;
  private lightTableViewId: ElementId;
  private onSuccess: ClassViewCreatedCallback;

  public static cloneFrom(classView: ClassView, onSuccess?: ClassViewCreatedCallback): CreateClassViewCommand {
    var command = new CreateClassViewCommand();
    command.classView = classView;
    command.onSuccess = onSuccess;
    return command;
  }

  constructor() {
    this.lightTableViewId = new ElementId(LocationToolbox.getLightTableViewIdFromPathName()); // TODO: hacky -> should be replaced with global local app model, which will be injected
  }

  run() {
    this.lazyLoadServiceDocument(() => {
      this.createClassView()
    });
  }

  private createClassView() {
    var href = CreateClassViewCommand.projectManagerServiceDocument.getHref(projectmanager.REL.CLASS_VIEWS);
    href = href.replace("{projectId}", this.classView.projectId); // TODO: hacky !!! -> should use URI expansion
    href = href.replace("{classId}", this.classView.classId); // TODO: hacky !!! -> should use URI expansion
    href = href.replace("{parentViewId}", this.lightTableViewId.id); // TODO: hacky !!! -> should use URI expansion

    $.post(href, (jsonData) => {
      var document: HyperMediaDocument<ClassView, void> = new HyperMediaDocument<ClassView, void>(jsonData);
      var NewLinksCreated = document.getHalLinkObject(); // TODO: hacky !!! -> we need to have created _links BUT we don't want to have them on the classView object!
      var classViewId = document.getData().id;
      this.classView.id = classViewId.id;

      var cvHref = CreateClassViewCommand.projectManagerServiceDocument.getHref(projectmanager.REL.CLASS_VIEW);
      cvHref = cvHref.replace("{classViewId}", classViewId.value); // TODO: hacky !!! -> should use URI expansion && classViewId.value is fuck shit wrogn :/
      if (cvHref) {

        // TODO: challenge this property removal, its necessary because of JSON circular reference
        delete this.classView.parentElement;
        delete this.classView.fabricModel;
        delete this.classView.clazz;
        delete this.classView._links;

        var settings: JQueryAjaxSettings = {
          type : 'put',
          contentType : 'application/json',
          data : JSON.stringify(this.classView),
          success : (data: any, textStatus: string, jqXHR: JQueryXHR) => {
            this.classView._links = NewLinksCreated;
            if (this.onSuccess) this.onSuccess(this.classView)
          }
        };
        $.ajax(cvHref, settings);
      }
    });
  }

  public canUndo(): boolean {
    return false;
  }

  undo() {
    // nothing to do here
  }

  private lazyLoadServiceDocument(callback: ()=>void) {
    if (!CreateClassViewCommand.projectManagerServiceDocument) {
      $.get(profiles.projectManagerBaseUri, jsonData => {
        CreateClassViewCommand.projectManagerServiceDocument = new HyperMediaDocument<void, void>(jsonData);
        callback.apply(this);
      });
    } else {
      callback.apply(this);
    }
  }

}