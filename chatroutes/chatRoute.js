// chatRoute.js
// This file contains the server-side route for handling chat requests and communicating with the OpenAI API.
// Import necessary libraries and modules
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { v4: uuidv4 } = require('uuid');
const ChatSession = require('../models/chatHistory');  // Import the Mongoose model
// Create a configuration object for OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an instance of OpenAIApi with the configuration
const openai = new OpenAIApi(configuration);

// Log the OpenAI API key for debugging purposes
console.log(process.env.OPENAI_API_KEY);

module.exports = () => {
  // Start a new chat session
  router.post('/start', async (req, res) => {
    console.log('Received request to /start');
    const sessionId = uuidv4(); // Generate a random session id
    const createdSession = new ChatSession({
      _id: sessionId,
      startTime: new Date(),
      messages: [
        { 
          role: 'system', 
          content: "You are Liara, an AI assistant with a personality inspired by Liara Tsoni from the Mass Effect universe, you are going to be my personal AI assistant that I am making myself"
        }
      ]
    });
    await createdSession.save();
    console.log('Created new session:', createdSession);
    res.send({ sessionId });
  });


  // Define the POST route for the chat
  router.post('/', async (req, res) => {
    try {
      // Extract the user's message and session id from the request body
      const { prompt, sessionId } = req.body;
      console.log("User's question:", prompt);

      // Get the session history from the database
      const session = await ChatSession.findById(sessionId);
      const history = session.messages;

      // Add the user's message to the session history
      history.push({ role: 'user', content: prompt ? prompt : ' ' });

      // Send the session history to OpenAI API for completion
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: history,
        max_tokens: 6000, // Adjust the maximum number of tokens in the response
        temperature: 0.8, // Control the randomness of the output (0.0 for deterministic, 1.0 for highly random)
        n: 1, // Control the number of responses to generate
        //...stop: ["\n"], // Stop generation when a newline character is encountered
      });

      // Log the response from OpenAI API
      console.log("OpenAI response data:", JSON.stringify(response.data, null, 2));

      // Check if the response contains choices
      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error('No choices in OpenAI response');
      }

      // Extract the text from the response
      let text = '';
      if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
        text = response.data.choices[0].message.content.trim();
      } else {
        console.error('No text in OpenAI response');
        throw new Error('No text in OpenAI response');
      }

      // Add the AI's message to the session history and update it in the database
      history.push({ role: 'assistant', content: text });
      session.messages = history;
      await session.save();
      
      // Log the updated session
      console.log("Updated session:", session);


      // Send the AI-generated message as a response
      res.json({ message: text });
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        console.error('Error details:', error.response.data.error);
      } else {
        console.error('No response in error object');
      }
      console.error('Full error object:', error);
      res.status(500).json({ error: error.toString() });
    }
  });

  return router;
};
