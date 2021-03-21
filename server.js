process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = 5000;
// Load the module dependencies
var mongoose = require('./config/mongoose'),
    express = require('./config/express');
// Create a new Mongoose connection instance
var db = mongoose();
// Create a new Express application instance
var app = express();
// Use the Express application instance to listen to the '3000' port
app.listen(port);
// Use the module.exports property to expose our Express application instance for external usage
module.exports = app; //returns the application object
// Log the server status to the console
console.log(`Server running at http://localhost:${port}/`);