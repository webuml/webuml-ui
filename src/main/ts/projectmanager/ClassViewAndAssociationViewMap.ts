export = ClassViewAndAssociationViewMap;

import ClassView = require('domain/ClassView');
import AssociationView = require('domain/AssociationView');

class ClassViewAndAssociationViewMap {

  private static classViewToAssociationView: { [index: string]: AssociationView[]; } = {};
  private static associationViewToClassView: { [index: string]: ClassView[]; } = {};

  public static insert(classView: ClassView, associationView: AssociationView): void {
    ClassViewAndAssociationViewMap.insertClassViewToAssociationView(classView, associationView);
    ClassViewAndAssociationViewMap.insertAssociationViewToClassView(associationView, classView);
  }

  private static insertClassViewToAssociationView(classView: ClassView, associationView: AssociationView): void {
    var associationViewList = ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href];
    if (!associationViewList) {
      associationViewList = ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href] = [];
    }
    associationViewList.push(associationView);
  }

  private static insertAssociationViewToClassView(associationView: AssociationView, classView: ClassView) {
    var classViewList = ClassViewAndAssociationViewMap.associationViewToClassView[associationView._links.self.href];
    if (!classViewList) {
      classViewList = ClassViewAndAssociationViewMap.associationViewToClassView[associationView._links.self.href] = [];
    }
    classViewList.push(classView);
  }

  public static getAssociationViewsFor(classView: ClassView): AssociationView[] {
    var associationViewList = ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href];
    if (!associationViewList) {
      return [];
    }
    return associationViewList;
  }

  public static getClassViewesFor(associationView: AssociationView): ClassView[] {
    var classViewList = ClassViewAndAssociationViewMap.associationViewToClassView[associationView._links.self.href];
    if (!classViewList) {
      return [];
    }
    return classViewList;
  }

  public static removeClassView(classView: ClassView): void {
    var associationViewList = ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href];
    if (!associationViewList) {
      return;
    }
    delete ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href];

    _.each(associationViewList, (associationView: AssociationView) => {
      ClassViewAndAssociationViewMap.deleteInternal(associationView);
    })
  }

  private static deleteInternal(associationView: AssociationView) {
    var classViewList = ClassViewAndAssociationViewMap.associationViewToClassView[associationView._links.self.href];
    if (!classViewList) {
      return;
    }
    delete ClassViewAndAssociationViewMap.associationViewToClassView[associationView._links.self.href];

    _.each(classViewList, (classView: ClassView) => {
      var associationViewList = ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href];
      if (associationViewList) {
        if (associationViewList.length == 1) {
          delete ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href];
        } else {
          var index = _.indexOf(associationViewList, associationView);
          if (index >= 0) {
            associationViewList[index] = associationViewList[associationViewList.length - 1];
            var reducedArray = associationViewList.slice(0, associationViewList.length - 2);
            ClassViewAndAssociationViewMap.classViewToAssociationView[classView._links.self.href] = reducedArray;
          }
        }
      }
    })
  }

}