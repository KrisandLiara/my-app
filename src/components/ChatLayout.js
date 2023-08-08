// Import necessary libraries and modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chat.css';

// Define the ChatLayout component
function ChatLayout() {
  // Declare state variables
  const [userInput, setUserInput] = useState(""); // The user's current input
  const [chatHistory, setChatHistory] = useState([]); // The history of the chat
  const [sessionId, setSessionId] = useState(null); // The id of the current chat session

  // Define a function to auto-expand the textarea
  const autoExpand = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  // Define a function to handle changes to the user's input
  const handleUserInput = (event) => {
    setUserInput(event.target.value); // Update the userInput state variable with the new input
    autoExpand(event.target); // Auto-expand the textarea
  }

  // Define a function to start a new chat session
  const startChat = async () => {
    console.log('Sending request to /start');
    const response = await axios.post('/api/v1/chat/start'); // Send a request to the /start endpoint
    const { sessionId } = response.data; // Extract the session id from the server's response
    setSessionId(sessionId); // Set the sessionId state variable with the new session id
  };

// Define a function to handle sending a message
const handleSendMessage = async () => {
  console.log('Send button clicked. User input:', userInput); // Log when the Send button is clicked

  if (userInput.trim() !== '') {
    // Start a new session if one hasn't been started yet
    if (!sessionId) {
      try {
        await startChat();
      } catch (error) {
        console.error('Error starting chat session:', error);
        return;  // Return early if an error occurred
      }
    }

    setChatHistory((prevMessages) => [...prevMessages, { text: userInput, from: 'user' }]);
    setUserInput('');

    try {
      const response = await axios.post('/api/v1/chat', { prompt: userInput, sessionId });
      const { data } = response;
      console.log('Response from server: ', data);
      if (data.message) {
        setChatHistory((prevMessages) => [...prevMessages, { text: data.message, from: 'bot' }]);
        setUserInput('');
        console.log('Updated messages: ', chatHistory);
      } else {
        console.error('No message in response data:', data);
      }
    } catch (error) {
      console.error('Error sending chat request:', error);
    }
  }
};

  // Define a function to handle the Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // If the Enter key is pressed without the Shift key
      event.preventDefault(); // Prevent the default action (submitting the form)
      handleSendMessage(); // Send the user's message
    }
  };

  // Use the useEffect hook to start a new chat session when the component mounts
  useEffect(() => {
    startChat();
  }, []);

  // Render the component
  return (
    <div className="chat-layout">
      <div className="chat-box">
        {chatHistory.map((message, index) => (
          <div key={index} className={message.from === 'user' ? 'user-message' : 'bot-message'}>
            <span>{message.from === 'user' ? 'User: ' : 'Bot: '}</span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea className="expanding-textarea" value={userInput} onChange={handleUserInput} onKeyPress={handleKeyPress} placeholder="Type your message here..."></textarea>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

// Export the ChatLayout component
export default ChatLayout;
