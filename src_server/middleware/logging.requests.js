var fileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morganLogger = require('morgan');

module.exports = function (app, config) {

    /* Checking whether HTTP logging is enabled in configuration */
    if (!config.logging.requests.enabled) {
        return;
    }

    /* Ensuring the output log folder exists  */
    var logsDirectory = __dirname + '/../' + config.logging.requests.folder;
    fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

    /* Initializing Morgan logger */
    app.use(morganLogger(
        config.logging.requests.format, {
            stream: fileStreamRotator.getStream({
                filename: logsDirectory + '/requests-%DATE%.log',
                frequency: 'daily',
                date_format: 'YYYY-MM-DD',
                verbose: false
            }),
            skip: function (req, res) {
                return res.statusCode < 400 && config.logging.requests.onlyErrors
            }
        }));
};