var express = require('express');
var logfmt = require('logfmt');
var serverProfiles = require('./server-profile-loader');

/*
 WebUml UI
 ---------
 Usage (run in project root folder):
 $> node "node server.js"
 */

var argv = require('minimist')(process.argv.slice(2));
var activeProfileName = argv.profiles && argv.profiles.active;
var appConfig = serverProfiles.loadProfile(activeProfileName);

// default configuration
var buildFolder = "/build/target";
var port = Number(process.env.PORT || 8080);

function openClassDiagramView(req, res) {
  res.sendfile(__dirname + buildFolder + "/classes.html");
}

function sendActiveProfile(req, res) {
  res.set('Content-Type', 'application/x-javascript');
  var clientConfigScript = "var WebUmlProfile = WebUmlProfile || " + JSON.stringify(appConfig);
  res.send(clientConfigScript);
}

// ##########################################################################
// App starts here.
// ##########################################################################
var app = express();

app.use(logfmt.requestLogger());
app.get("/projects/:projectid", openClassDiagramView);
app.get("/lightTables/:lightTableViewId", openClassDiagramView);
app.get("/profile.js", sendActiveProfile);
app.use(express.static(__dirname + buildFolder));

app.listen(port);

console.log('Active Profile      : ' + (activeProfileName || ''));
console.log('Serving static from : ' + buildFolder);
console.log('Listening on port   : ' + port);