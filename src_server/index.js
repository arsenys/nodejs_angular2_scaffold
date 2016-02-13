var config = require('./config.json');
var express = require('express');

var api = require('./api/api');

var parsers = require('./middleware/parsers');
var errorsHttp = require('./middleware/errors.http');

var loggingRequests = require('./middleware/logging.requests');
var loggingActivity = require('./middleware/logging.activity');

var port = config.isProduction ? config.server.ports.production : config.server.ports.development;

var app = express();

loggingRequests.init(app, config);
loggingActivity.init(config);

parsers.init(app);

app.use(express.static('./' + config.server.staticFolder ));

api.register(app, config);

errorsHttp.init(app, loggingActivity, config);

app.listen(port, function () {
    console.log('Express server is started on port ' + port);
});