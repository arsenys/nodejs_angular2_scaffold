var config = require('./config.json'),
    express = require('express');

var port = config.isProduction ?
    config.server.ports.production :
    config.server.ports.development;

/* Creating Express application */
var app = express();

/* Initializing multi-transport async logging with Winston middleware */
var logger = require('./middleware/logging.activity')(app, config);
logger.log('info', 'Logger initialized');

/* Initializing HTTP request logger middleware with Morgan middleware */
require('./middleware/logging.requests')(app, config);
logger.log('info', 'HTTP request logger initialized');

/* Setting up common middleware parsers for Express for cookies, json etc. */
require('./middleware/parsers')(app, config);
logger.log('info', 'Middleware parsers set up');

/* Configuring static folder for Express where Angular2 app is published to */
app.use(express.static('./' + config.server.staticFolder));
logger.log('info', 'Static folder for app configured in "' + config.server.staticFolder + '"');

/* Registering routes for APIs */
app.use('/' + config.server.apiBasePath, require('./routes/api'));
logger.log('info', 'Registered routes for API on "/' + config.server.apiBasePath + '"');

/* Registering custom HTTP error handlers for 404 and 500 */
require('./middleware/errors.http')(app, logger, config);
logger.log('info', 'Registered custom HTTP error handlers');

/* Starting server */
app.listen(port, function () {
    logger.log('info', 'Express server is started on port ' + port);
});