declare var require: (deps: string[], func: (args)=>any) =>any;

/**
 * Main entry point for RequireJS
 */
require(['Application'], (WebUml) => {
    'use strict';
    var app = new WebUml.Application();
  }
);