'use client';

import { useState, useEffect, useRef } from 'react';
import socket from '../lib/socket';
import { FaGlobe } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeUserSocketId, setActiveUserSocketId] = useState('');
  const [name, setName] = useState(''); // Empty initial state
  const [showNamePopup, setShowNamePopup] = useState(false); // Default false
  const messagesEndRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('chatName') : null;
    if (storedName) {
      setName(storedName);
    } else {
      setShowNamePopup(true); // Show popup only on client if no name
    }

    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message.text, name: message.name, isOwn: message.name === storedName },
      ]);
    });

    socket.on('activeUsers', (globalOnlineUsersList) => {
      setActiveUsers(globalOnlineUsersList.length);
    });

    socket.on('connect', () => {
      // console.log('Connected with socket ID:', socket.id);
      setActiveUserSocketId(socket.id);
    });

    socket.on('typing', (user) => {
      setTypingUsers((prev) => {
        if (!prev.includes(user)) return [...prev, user];
        return prev;
      });
    });

    socket.on('stopTyping', (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    return () => {
      socket.off('message');
      socket.off('activeUsers');
      socket.off('connect');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [activeUserSocketId]); // No dependency on name here, only initial setup

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('chatName', name);
      setShowNamePopup(false);
    }
  };

  const sendMessage = () => {
    if (input.trim() && name) {
      const messageData = { text: input, name };
      socket.emit('message', messageData);
      setMessages((prev) => [...prev, { text: input, name, isOwn: true }]);
      setInput('');
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!socket) return;

    socket.emit('typing', name);

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set new timeout for stopTyping
    const timeout = setTimeout(() => {
      socket.emit('stopTyping', name);
    }, 2000);

    setTypingTimeout(timeout);
  };


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
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[80vh]">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold flex justify-center items-center gap-2">
          <FaGlobe className="text-xl" />Chat
        </h2>
        <span className="bg-green-700 px-3 py-1 rounded-full text-sm">
          {activeUsers} Online
        </span>
      </div>
      {
        activeUserSocketId && <div className="flex items-center justify-center w-full">
          <span className="text-gray-500 text-sm">
            You are connected as {name} with socket ID: {activeUserSocketId}
          </span>
        </div>
      }

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-xs">
              <div
                className={`p-3 rounded-lg min-w-40 shadow ${msg.isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'
                  }`}
              >

                <div className="text-xs font-semibold opacity-80  mb-1">
                  {msg.name || 'Unknown'}
                </div>
                <hr />
                <p className="text-base">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Typing Feedback */}
      <div className="min-h-[20px] mb-5">
        {typingUsers.length > 0 && (
          <p className="italic px-2 py-1 text-gray-500">
            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </p>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border border-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={name ? `${name} Type a message...` : 'Type a message...'}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 px-4 rounded-r-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;