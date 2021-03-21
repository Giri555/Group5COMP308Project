// Load the index controller
var index = require('../controllers/index.server.controller');

// Define the routes module method
module.exports = function (app) {

    // show the 'index' page if a GET request is made to root
    app.route('/').get(index.render);

};
