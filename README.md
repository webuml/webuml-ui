webuml-ui
===============

The HTML5 based browser UI to webuml.

Minimum preconditions:
---------------

- Node.js v10.25+
- npm (mostly included in node.js)

Install dependencies AND build
------

```
> npm install
```

This will trigger npm to download all dependencies and will trigger grunt for building everything.

You can build manually via

```
> grunt
```

You can run a watch task, which will automatically build everything, when files changed

```
> grunt watch
```


Manual Start
------

```
> npm start --profiles.active=local
```


Local Development
-----------------

Grunt asembles static content from src/main/ to build/.
Grunt also assembles javascript files from src/main/js/** to build/webuml_ui[_min].js.

The grunt watch tasks watches the src/main folder and executes the task 'no-uglify' on any file change.
Just reload your browser window afterwards.

To activate the grunt watch task:

1. IntelliJ IDEA -> Right-Click on gruntfile.js -> Open Grunt Console -> Double-click on task "watch".
2. Point your Browser to localhost:8080
3. Make changes in html, js, css and reload browser window afterwards.

Node serves static content from build/ via express. Therefore start node:

Precondition: node.js plugin installed.

Create a node run configuration in IDEA:

- working-directory: webuml-ui
- JavaScript File: server.js
- Application Parameters: "start --profiles.active=local"



Point your browser to localhost:8080.

Local Testing
----------------

```
> npm test
```

OR

Configure IntelliJ IDEA to use Mocha test plugin.
See https://www.jetbrains.com/idea/webhelp/running-mocha-unit-tests.html for details.


Deploy on Heroku
------

    App: 		    https://webuml-ui.example.org
    Config: 	    /Procfile
    Properties: 	application-heroku.properties


3rd Party Libraries
------
External Javascript libraries are managed via [Bower](http://bower.io).

You only need to have a global installation of Bower,
when you want to update libraries (jquery, fabric, etc.).

````
> bower update
````
will do the job for you ;-)
