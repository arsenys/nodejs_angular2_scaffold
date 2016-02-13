module.exports = {
  register: function (app) {

      app.get('/{{GULP_SETTINGS_API_BASE_PATH}}/hello', function (req, res) {
          res
              .json({message: 'Hello World!'})
              .end();
      });

      app.get('/{{GULP_SETTINGS_API_BASE_PATH}}/make-error', function (req, res) {
          res.send(xxx.length).end();
      });

  }
};
