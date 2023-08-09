// Import the mongoose library, which provides tools for working with MongoDB in Node.js
const mongoose = require('mongoose');

// Define a schema for individual messages
// This is a sub-document schema, meaning it's used within another schema (in this case, chatSessionSchema)
const messageSchema = new mongoose.Schema({
  role: String,      // Role can be 'user', 'bot', 'system', etc. It indicates who sent the message.
  content: String    // The actual content or text of the message.
}, { _id: false });  // This option prevents MongoDB from automatically generating an _id for each individual message.

// Define the main schema for chat sessions
const chatHistorySchema = new mongoose.Schema({
  _id: String,       // Use the session ID as the primary key. This will be a unique identifier for each chat session.
  startTime: Date,   // The date and time when the chat session started.
  messages: [messageSchema]  // An array of messages. Each message follows the structure defined in messageSchema.
});

// Export the ChatSession model based on the chatSessionSchema.
// This model can be used in other parts of the application to interact with the 'chatHistory' collection in MongoDB.
module.exports = mongoose.model('chatHistory', chatHistorySchema, 'chatHistory');

