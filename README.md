# NodeJS / ExpressJS / Angular 2 / Jade / SCSS

## Main features
* **NodeJS** - server platform
    - **Morgan** - HTTP logger
    - **Winston** - activity logger
* **ExpressJS 4** - web framework
    - **JSON, Cookies** - body parsers
    - **Favicons** - meta and files
    - **Social Meta Tags** - Open Graph metadata
    - **Custom Error Pages** - 404 and 500 error pages are custom and can be designed
* **Angular2** - frontend framework
    - **Beta 3** - implemented with latest Angular2 beta
    - **Examples** - example pages for Pipes, Directives, Async pipe, Service with HTTP request to external API
    - **Routing** - basic implementation of regular and lazy routing
    - **Typescript** - frontend app written in TypeScript
    - **Typings** - included relevant TypeScript definitions and Typings library
* **Libraries** - additional optional libraries for frontend app included
    - **jQuery** - DOM manipulation and utils
    - **Lodash** - collections, arrays and data manipulation
    - **MomentJS** - date and time manipulation
* **Jade** - HTML templating for frontend app
* **SCSS** - styling for frontend app
* **Gulp** - building automation

## Installation

* You must have NodeJS installed.

Prerequisites are:

* Gulp:
```
npm install -g gulp
```
* Typings:
```
npm install -g typings
```
* Initial packages:
```
npm install
```
* Initial TypeScript definitions:
```
typings install
```

Use `gulp default` to perform full build to deployment folder and start the server

## Folder structure
```
.
|   gulpfile.js   (Gulp tasks file)
|   gulpfile.config.js   (Build settings and configurations for client and server)
|   package.json   (main NodeJS info and dependencies file for development)
|   tsconfig.json   (TypeScript configuration file for compiler)
|   typings.json   (Typings d.ts dependecies for the project)
|
+-- src_client
|   |   _common.meta.include.jade   (common header meta)
|   |   _common.scripts.app.include.jade   (scripts related to Angular2)
|   |   _common.scripts.base.include.jade   (basic scripts for website)
|   |   _common.styles.include.jade   (all styles inclusion)
|   |   _layout.error.include.jade   (layout for the error pages)
|   |   index.jade   (main Angular2 page with initialization)
|   |   error.404.jade   (content for 404 - not found error page)
|   |   error.500.jade   (content for 500 - server error page)
|   +-- app   (folder of the angular2 application)
|       +-- components   (folder for all app components)
|       +-- directives   (folder for app directives)
|       +-- pipes   (folder for pipes)
|       +-- services   (folder for data and other service classes)
|           app.component.ts   (root app compinent with routing)
|           app.init.ts   (bootstrapping of Angular2 app)
|   +-- resources   (folder for static resources like images and favicons)
|   +-- styles   (folder for SCSS files of the website and app)
+-- src_server
|   |   index.js   (main NodeJS server file)
|   |   package.json   (NodeJS info and dependencies file for published app)
|   +-- api   (folder for server API implementations)
|   +-- middleware   (various middleware initialization files used by index.js)
+-- typings    (resolved d.ts definition files for TypeScript)
```
## Configuration

To configure the build and application variables you have to modify `gulpfile.config.js` file.
The

Following configurations available:

* Info
    - `TITLE` - Application name
    - `KEYWORDS` - Keywords for meta tag
    - `DESCRIPTION` - Description for meta tag
* Folders
    - `DIST` - Target folder name for built distribution
    - `SOURCES` - Folders for _server_ and _client_ source files
    - `CLIENT`
        - `ROOT` - ExpressJS static folder - to deploy client app files
        - `CONTENT` - Folders names inside _root_ for _vendor_,_styles_ and _images_
    - `SERVER` -
        - `API_BASE_PATH` - URL part name for application API
        - `REQUESTS_LOGS` - Folder name for HTTP Requests logs
        - `ACTIVITY_LOGS` - Folder name for app activity logs
* `PRODUCTION` -
* Port
    - `PRODUCTION` - Server port when running in _production_ enviroment
    - `DEVELOPMENT` - Server port when running in _devemopment_ mode
* Logs
    - `REQUESTS_LOGS_ENABLED` - Enable or disable _Morgan_ HTTP logs
    - `REQUESTS_FORMAT` - Format of the _Morgan_ logs values:
      - `combined` - Standard Apache combined log output
      - `common` - Standard Apache common log output
      - `dev` - Concise output colored by response status for development use
      - `short` - Shorter than default, also including response time
      - `tiny` - The minimal output
    - `REQUESTS_ONLY_ERRORS` - Whether to include all requests all only errors
    - `ACTIVITY_LOGS_ENABLED` - Enable or disable app activity logs
    - `ACTIVITY_MAX_SIZE_MB` - Maximum size in MB per activity log file
    - `ACTIVITY_MAX_FILES` - Maximum files to keep on server for activity logs
    - `ACTIVITY_JSON_FORMAT` - Whether to write logs as _json_ or plain text
* Utilities
    - `JQUERY` - Whether to include _jQuery_ in bundleded vendor scripts
    - `LODASH` - Whether to include _Lodash_ in bundleded vendor scripts
    - `MOMENT` - Whether to include _MomentJS_ in bundleded vendor scripts
    - `MOMENT_WITH_LOCALES` - If _MomentJS_ included, defines whether to include version with locales extensions


## Gulp Tasks

_Note: All **Jade** and **SCSS** that match the pattern of `*.include.jade` and `*.include.scss` will not be compiled and copied to distribution folder. User this for files that are used as includes for actual files._

* `Default task` - Cleans distribution folder, builds all, and starts server
* Aggregated tasks
    - `_build-all` - Builds server and client
    - `_server` - Runs all server related tasks
    - `_client` - Runs all client related tasks
* Actions
    - `_start` - Starts node server in distribution folder
    - `_clean` - Cleans distribution folder
* Client
    - `client-app-html` - Compiles app Jade files to HTML
    - `client-app-scripts` - Compiles app Typescript files to JavaScript
    - `client-app-styles` - Compiles app SCSS styles to CSS
    - `client-resources-favicons` - Copies favicons to from images to root folder
    - `client-resources-images` - Copies all images to distribution folder
    - `client-vendor-scripts` - Combines and copies all vendor scripts
    - `client-vendor-styles` - Combines and copies all vendor stylesheets
* Server
    - `server-config-json` - Generates configuration file in distribution folder based on _gulpfile.config.js_
    - `server-package-json` - Copies and modifies info to distribution folder
    - `server-scripts` - Copies server scripts to distribution folders
    - `server-npm-install` - Runs _npm install_ to install dependency packages in distribution folder for NodeJS
