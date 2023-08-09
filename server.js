// 1. Importing required modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');
const app = express();
const mongoose = require('mongoose');  // Import mongoose for MongoDB operations

// Enable CORS
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.COSMOS_DB_MONGODB_API_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Use express-session for session management
app.use(session({
  secret: 'mySuperSecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: process.env.COSMOS_DB_MONGODB_API_CONNECTION_STRING,  // Replace with your Cosmos DB's MongoDB API connection string
    collectionName: 'sessions'  // This is the collection where sessions will be stored
  }),
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json()); // Use the express.json middleware to parse JSON request bodies

// Define routes
const chatRoute = require('./chatroutes/chatRoute')();  // No container argument
app.use('/api/v1/chat', chatRoute);

const valdisChatRoute = require('./chatroutes/valdisChatRoute'); // Import the valdisChatRoute module
app.use('/api/v1/chat/valdis', valdisChatRoute); // Use the valdisChatRoute middleware for requests to /api/v1/chat/valdis

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught an error:', err.stack);
  res.status(500).json({ error: err.toString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'));
  });
}
// Start the server
const port = process.env.PORT || 5000; // Use the PORT environment variable if available, or use 5000 as default
app.listen(port, () => { // Start the server and listen for requests on the specified port
  console.log(`Server is running on port ${port}`);
  console.log('Open the following link in your browser: http://localhost:' + port);
});



