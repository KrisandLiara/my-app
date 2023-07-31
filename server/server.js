//server.js
// 1. Importing required modules
require('dotenv').config({ path: __dirname+'/.env' });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS
app.use(cors());

// Use express-session for session management
app.use(session({
  secret: 'mySuperSecretKey',  // replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }  // set to true if your app is on https
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// routes
const chatRoute = require('./chatRoute');
app.use('/api/v1/chat', chatRoute);  // Note the version number in the route

const port = process.env.PORT || 5000; // Use the PORT environment variable if available, or use 5000 as default
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.toString() });
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
  console.log('Open the following link in your browser: http://localhost:' + port);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}
