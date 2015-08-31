// build instructions for require.js
require.config({
  wrap: true,
  deps: ['main'],
  include: [ /* not yet used*/ ],
  insertRequire: ['main'],
  baseUrl: "",
  paths: {
//    fabric: "fabric"
  }
});
