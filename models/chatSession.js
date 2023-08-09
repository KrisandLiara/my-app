const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: String,
  content: String
}, { _id: false });  // Prevent automatic generation of _id for each message

const chatSessionSchema = new mongoose.Schema({
  _id: String,  // Use the session ID as the primary key
  startTime: Date,
  messages: [messageSchema]
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
