var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

module.exports = function (app, config) {

    // Middleware to process JSON requests
    app.use(bodyParser.json());

    /* middleware that only parses urlencoded bodies.
     * This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings
     */
    app.use(bodyParser.urlencoded({
        /* Using 'qs' library for parsing */
        extended: true
    }));

    // Middleware that parses Cookie header and populate req.cookies with an object keyed by the cookie names
    app.use(cookieParser());
};