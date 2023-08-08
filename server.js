// 1. Importing required modules
require('dotenv').config(); // Load environment variables from a .env file into process.env
const express = require('express'); // Import Express, a web application framework for Node.js
const session = require('express-session'); // Import express-session, a middleware for handling sessions
const cors = require('cors'); // Import CORS, a middleware for enabling Cross-Origin Resource Sharing
const path = require('path'); // Import the path module, which provides utilities for working with file and directory paths
const app = express(); // Create an Express application

// 2. Connecting to Cosmos DB
const { CosmosClient } = require("@azure/cosmos"); // Import the CosmosClient class from the @azure/cosmos package
const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING); // Create a new CosmosClient instance with the connection string from the environment variables
console.log('Connected to Cosmos DB'); // Log a message to indicate that the connection was successful
const database = client.database('appdb'); // Get a reference to the database
const container = database.container('chatSessions'); // Get a reference to the container

// Enable CORS
app.use(cors()); // Use the CORS middleware

// Use express-session for session management
app.use(session({
  secret: 'mySuperSecretKey',  // replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }  // set to true if your app is on https
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json()); // Use the express.json middleware to parse JSON request bodies

// Define routes
const chatRoute = require('./chatroutes/chatRoute')(container); // Import the chatRoute module
app.use('/api/v1/chat', chatRoute);  // Use the chatRoute middleware for requests to /api/v1/chat

const valdisChatRoute = require('./chatroutes/valdisChatRoute'); // Import the valdisChatRoute module
app.use('/api/v1/chat/valdis', valdisChatRoute); // Use the valdisChatRoute middleware for requests to /api/v1/chat/valdis

// Start the server
const port = process.env.PORT || 5000; // Use the PORT environment variable if available, or use 5000 as default
app.listen(port, () => { // Start the server and listen for requests on the specified port
  console.log(`Server is running on port ${port}`);
  console.log('Open the following link in your browser: http://localhost:' + port);
});

// Global error handler
app.use((err, req, res, next) => { // Use a middleware function to handle errors
  console.error(err.stack); // Log the error stack trace
  console.error('Global error handler caught an error:', err.stack); // Log the error stack trace
  res.status(500).json({ error: err.toString() }); // Send a response with the error message and a 500 status code
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') { // If the app is running in production mode
  app.use(express.static(path.join(__dirname, './build'))); // Serve static files from the build directory

  app.get('*', (req, res) => { // Handle all GET requests
    res.sendFile(path.resolve(__dirname, './build', 'index.html')); // Send the index.html file
  });
}
