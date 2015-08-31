export = ClassViewCache;

import ClassView = require('domain/ClassView');

class ClassViewCache {

  "use strict";

  private static cached: { [index: string]: ClassView } = {};

  public static resolve(relation: {instance: ClassView; href: string}, onResolve: (arg: any)=>any) {

    function putToCacheAndDoCallback(resolvedElement) {
      ClassViewCache.cached[relation.href] = resolvedElement;
      relation.instance = ClassViewCache.cached[relation.href];
      onResolve(relation.instance);
    }

    if (relation.instance) {
      onResolve(relation.instance);
    } else {
      if (ClassViewCache.cached[relation.href]) {
        putToCacheAndDoCallback(ClassViewCache.cached[relation.href]);
      } else {
        $.get(relation.href, putToCacheAndDoCallback);
      }
    }
  }

}
