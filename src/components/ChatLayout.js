//ChatLayout.js
import React, { useState } from 'react';
import axios from 'axios';
import './chat.css';

function ChatLayout() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (userInput.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, { text: userInput, from: 'user' }]);
      setUserInput('');
      try {
        const response = await axios.post('/api/v1/chat', { prompt: userInput });
        const { data } = response;
        console.log('Response from server: ', data);
        if (data.message) {
          setMessages((prevMessages) => [...prevMessages, { text: data.message, from: 'bot' }]);
          setUserInput('');
          console.log('Updated messages: ', messages);
        } else {
          console.error('No message in response data:', data);
        }
      } catch (error) {
        console.error('Error sending chat request:', error);
      }
    }
  };

  const handleUserInput = (event) => {
    const message = event.target.value;
    setUserInput(message);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={message.from === 'user' ? 'user-message' : 'bot-message'}>
            <span>{message.from === 'user' ? 'User: ' : 'Bot: '}</span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea value={userInput} onChange={handleUserInput} onKeyPress={handleKeyPress} placeholder="Type your message here..."></textarea>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatLayout;
