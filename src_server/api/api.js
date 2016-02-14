module.exports = {
    register: function (app, config) {

        app.get('/' + config.server.apiBasePath + '/hello', function (req, res) {
            res
                .json({message: 'Hello World!'})
                .end();
        });
    }
};
