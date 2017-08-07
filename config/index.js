var configValues = require('./config');

module.exports = {

    getDbConnectionString: function() {
        return 'mongodb://' + configValues.uname 
        + ":" + configValues.pwd + 
        '@ds131512.mlab.com:31512/nodetodosample';
    }
}