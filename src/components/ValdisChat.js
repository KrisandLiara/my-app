//ValdisChat.js
import React, { useState } from 'react';
import axios from 'axios';
import './chat.css';

function ChatLayout() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const autoExpand = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
    autoExpand(event.target);
  }

  const handleSendMessage = async () => {
    if (userInput.trim() !== '') {
      setChatHistory((prevMessages) => [...prevMessages, { text: userInput, from: 'user' }]);
      setUserInput('');
      try {
        const response = await axios.post('/api/v1/chat/valdis', { prompt: userInput });
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


  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-box">
        {chatHistory.map((message, index) => (
          <div key={index} className={message.from === 'user' ? 'user-message' : 'bot-message'}>
            <span>{message.from === 'user' ? 'Lashara: ' : 'Jenots: '}</span> {/* Change the names of the speakers */}
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

export default ChatLayout;
