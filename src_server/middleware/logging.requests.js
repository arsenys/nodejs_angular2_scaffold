var fileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morganLogger = require('morgan');

module.exports = {
    init: function (app, config) {
        if (!config.logging.requests.enabled) {
            return;
        }

        var logsDirectory = __dirname + '/../' + config.logging.requests.folder;

        fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);
        var appRequestsLogsStream = fileStreamRotator.getStream({
            filename: logsDirectory + '/requests-%DATE%.log',
            frequency: 'daily',
            date_format: "YYYY-MM-DD",
            verbose: false
        });

        app.use(morganLogger(config.logging.requests.format, {
            stream: appRequestsLogsStream,
            skip: function (req, res) {
                return res.statusCode < 400 && config.logging.requests.onlyErrors
            }
        }));
    }
};