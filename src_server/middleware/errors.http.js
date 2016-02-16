var fs = require('fs');

module.exports = function (app, logger, config) {
    if (!config.server.customErrorPages) {
        return;
    }

    /*
     * Catches Not Found errors (404), determines html/json/text request type and responses accordingly
     */
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
    });

    /*
     * Catches Internal Server errors (500), determines html/json/text request type and responses accordingly
     * NOTE: last param of the function 'next' is required in signature to catch error requests
     */
    app.use(function (err, req, res, next) {
        logger.error(err.message + '\n' + err.stack + '\n\n');
        res.status(500);
        if (req.accepts('html')) {
            res.send(
                fs.readFileSync(__dirname + '/../' + config.server.staticFolder + '/error.500.html', 'utf8')
                    .replace('{{ERROR}}', false ? '' : err.message)
                    .replace('{{STACK_TRACE}}', false ? '' : err.stack)
            )
        }
        else if (req.accepts('json')) {
            res.json({error: err.message});
        } else {
            res.send('Error');
        }
    });
};