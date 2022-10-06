process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = 5000;
// Load the module dependencies
const mongoose = require('./config/mongoose');
const express = require('./config/express');
const cluster = require('cluster');
const os = require('os');

const numberOfCPUs = os.cpus().length; // number of CPUs / cores

// Create a new Mongoose connection instance
var db = mongoose();
// Create a new Express application instance
var app = express();

if(cluster.isMaster)
{
        for(let i = 0; i < numberOfCPUs; i++)
        {
                cluster.fork();
        }

        // if a worker dies, start a new one
        cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} has died`);
                cluster.fork();
        });
}
else
{
        // Use the Express application instance to listen to the port
        app.listen(port, ()=> console.log(`Server with PID: ${process.pid} running at http://localhost:${port}/`));
}

module.exports = app;
