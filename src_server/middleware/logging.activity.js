var winston = require('winston');
var fs = require('fs');

module.exports = function (app, config) {

    /* Checking whether actions logging is enabled in configuration */
    if (!config.logging.activity.enabled) {
        return;
    }

    winston.emitErrs = true;

    /* Ensuring the output log folder exists  */
    var logsDirectory = __dirname + '/../' + config.logging.activity.folder;
    fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

    /* Initializing Winston logger returning it's instance */
    return new winston.Logger({
        transports: [
            new (winston.transports.File)({
                level: config.logging.activity.level,
                filename: 'logs.txt',
                maxsize: 1048576 * config.logging.activity.sizePerFileInMegabytes,
                maxFiles: config.logging.activity.maximumNumberOfFiles,
                dirname: logsDirectory,
                json: config.logging.activity.jsonFormat
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })],
        exitOnError: false
    })
};
