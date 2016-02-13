var fs = require('fs');

module.exports = {
    init: function (app, logger, config) {
        if (!config.server.customErrorPages) {
            return;
        }

        app.use(function (req, res) {
            res.status(404);

            if (req.accepts('html')) {
                res.send(fs.readFileSync(__dirname + '/../' + config.server.staticFolder + '/error.404.html', 'utf8'))
            }
            else if (req.accepts('json')) {
                res.send({error: 'Not found'});
            } else {
                res.send('Not found');
            }
            res.end();
        });

        app.use(function (err, req, res, next) {
            logger.error(err.message + '\n' + err.stack + '\n\n');
            res.status(500);
            if (req.accepts('html')) {
                res.send(
                    fs.readFileSync(__dirname + '/../' + config.server.staticFolder + '/error.500.html', 'utf8')
                        .replace('{{ERROR}}', false ? '' : err.message)
                        .replace('{{STACK_TRACE}}', false ? '' : err.stack)
                );
            } else {
                res.json({error: err.message});
            }
            res.end();
        });
    }
};