'use client';

import { useState, useEffect, useRef } from 'react';
import socket from '../lib/socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const [name, setName] = useState(localStorage.getItem('chatName') || ''); // Load from localStorage
  const [showNamePopup, setShowNamePopup] = useState(!localStorage.getItem('chatName')); // Show popup if no name
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message.text, name: message.name, isOwn: message.name === name },
      ]);
    });

    // Listen for active users count
    socket.on('activeUsers', (count) => {
      setActiveUsers(count);
    });

    // Optional: Log connection for debugging
    socket.on('connect', () => {
      console.log('Connected with socket ID:', socket.id);
    });

    // Cleanup on unmount
    return () => {
      socket.off('message');
      socket.off('activeUsers');
      socket.off('connect');
    };
  }, [name]); // Dependency on name to update isOwn correctly

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('chatName', name); // Save to localStorage
      setShowNamePopup(false); // Hide popup
    }
  };

  const sendMessage = () => {
    if (input.trim() && name) {
      const messageData = { text: input, name }; // Send name with message
      socket.emit('message', messageData);
      setMessages((prev) => [...prev, { text: input, name, isOwn: true }]); // Add own message locally
      setInput('');
    }
  };

  // If name popup is visible, show it instead of chat
  if (showNamePopup) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">Enter Your Name</h2>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your name..."
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
      {/* Chat Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Global Chat ({name})</h2>
        <span className="bg-blue-700 px-3 py-1 rounded-full text-sm">
          {activeUsers} Active Users
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow ${
                msg.isOwn
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <span className="font-semibold">{msg.name}: </span>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border border-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 px-4 border border-blue-500 rounded-r-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;