'use client';

import { useState, useEffect, useRef } from 'react';
import socket, { backendURL } from '../lib/socket';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

const RoomChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const [name, setName] = useState('');
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [copied, setCopied] = useState(false); // Track if link was copied
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load
    if (!isSignedIn) return; // Don’t proceed if not signed in

    const storedName = typeof window !== 'undefined' ? localStorage.getItem('chatName') : '';
    if (storedName) {
      setName(storedName);
      fetchRoomById(id);
      joinRoom();
      socket.emit('joinRoom', id);
    } else {
      setShowNamePopup(true);
    }

    socket.on('roomMessage', (message) => {
      setMessages((prev) => [...prev, { ...message, isOwn: message.name === storedName }]);
    });

    socket.on('roomActiveUsers', (count) => setActiveUsers(count)); // Updated to roomActiveUsers

    return () => {
      socket.off('roomMessage');
      socket.off('roomActiveUsers');
    };
  }, [id, isLoaded, isSignedIn, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('chatName', name);
      setShowNamePopup(false);
      fetchRoomById(id);
      joinRoom();
      socket.emit('joinRoom', id);
    }
  };

  const sendMessage = () => {
    if (input.trim() && name) {
      const messageData = { text: input, name, id };
      socket.emit('roomMessage', messageData);
      setMessages((prev) => [...prev, { text: input, name, isOwn: true }]);
      setInput('');
    }
  };

  const fetchRoomById = async (id) => {
    try {
      const response = await axios.get(`${backendURL}/api/rooms/${id}`);
      if (response.data.success) {
        setSelectedRoom(response.data.room);
      } else {
        throw new Error('Room not found');
      }
    } catch (err) {
      console.log(err);
      setSelectedRoom(null);
    }
  };

  const joinRoom = async () => {
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;
    try {
      const response = await axios.post(`${backendURL}/api/rooms/join`, {
        member_email: user.primaryEmailAddress.emailAddress,
        room_id: id,
      });
      console.log('Joined room:', response.data);
    } catch (err) {
      console.log('Error joining room:', err);
    }
  };


  if (!isLoaded) return <div className="text-center p-4 text-blue-500">Loading user data...</div>;
  if (!isSignedIn) return <div className="text-center p-4 text-red-500">Please sign in to join the room</div>;

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
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[90vh] mx-auto pt-2 px-2">
      <div className="bg-blue-500 text-white p-2 rounded-t-lg flex flex-wrap justify-between items-center">
        <h2 className="text-lg font-semibold">Room: {selectedRoom?.name}</h2>
        <div className="flex space-x-2">
          
          <span className="bg-green-700 px-3 py-1 rounded-full text-sm">
            {selectedRoom?.members?.length} Members
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs">
              <div
                className={`p-3 rounded-lg shadow ${
                  msg.isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${msg.isOwn ? 'text-white' : 'text-gray-500'}`}>
                  {msg.name}
                </div>
                <p className="text-base">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border border-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`${name} Type a message...`}
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

export default RoomChat;