var Todos = require('../models/todoModel');
var bodyParser = require('body-parser');

module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/testres', function(req, res) {

        res.json({ error: 'no error', wow: 'this is a value pair bro' });
        res.status(200).end();

    });


    app.post('/authtest', function(req, res) {

      if(req.body.authcode && req.body.secondcode){
        res.send('authcode and other info recieved: '+req.body.authcode);

      }else{
        res.send('authcode not recieved: '+req.body.authcode);
      }

    });


}
