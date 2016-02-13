var winston = require('winston');
var fs = require('fs');

module.exports = {
    winstonLogger: null,

    init: function (config) {
        if (!config.logging.activity.enabled) {
            return;
        }

        winston.emitErrs = true;

        var logsDirectory = __dirname + '/../' + config.logging.activity.folder;

        fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

        this.winstonLogger = new winston.Logger({
            transports: [new (winston.transports.File)({
                level: config.logging.activity.level,
                filename: 'errors.txt',
                maxsize: 1048576 * config.logging.activity.sizePerFileInMegabytes,
                maxFiles: config.logging.activity.maximumNumberOfFiles,
                dirname: logsDirectory,
                json: config.logging.activity.jsonFormat
            }), new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })],
            exitOnError: false
        })
    },

    info: function (message) {
        this.winstonLogger.info(message);
    },

    warn: function (message) {
        this.winstonLogger.warn(message);
    },

    error: function (message) {
        this.winstonLogger.error(message);
    }
};
