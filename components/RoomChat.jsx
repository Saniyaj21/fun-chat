'use client';

import { useState, useEffect, useRef } from 'react';
import socket, { backendURL } from '../lib/socket';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { formatTimeAgo } from '@/helpers/dayAgo';
import { FaUserGroup } from "react-icons/fa6";
import LiveTimeAgo from './LiveTimeAgo';
import Link from 'next/link';
import { TbHandClick } from "react-icons/tb";


const RoomChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const [name, setName] = useState('');
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const inputRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showPreviousMessages, setShowPreviousMessages] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    const storedName = typeof window !== 'undefined' ? localStorage.getItem('chatName') : '';
    const previousMessagesToggle = typeof window !== 'undefined' ? localStorage.getItem('showPreviousMessages') : "false";
    if (storedName) {
      setName(storedName);
      // console.log(typeof(previousMessagesToggle));

      setShowPreviousMessages(previousMessagesToggle);
      fetchRoomById(id);
      joinRoom();
      roomsMessages(id)
      socket.emit('joinRoom', id);
    } else {
      setShowNamePopup(true);
    }

    socket.on('roomMessage', (message) => {
      setMessages((prev) => [...prev, { ...message, isOwn: message.name === storedName }]);
    });

    socket.on('roomActiveUsers', (count) => setActiveUsers(count));

    // Room-specific typing events
    socket.on('roomTyping', (user) => {
      setTypingUsers((prev) => {
        if (!prev.includes(user)) return [...prev, user];
        return prev;
      });
    });

    socket.on('roomStopTyping', (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    // console.log("load messages for room " + id)


    return () => {
      socket.off('roomMessage');
      socket.off('roomActiveUsers');
      socket.off('roomTyping');
      socket.off('roomStopTyping');
    };
  }, [id, isLoaded, isSignedIn, user, showPreviousMessages]);


  const roomsMessages = async (id) => {
    try {
      const response = await axios.get(`${backendURL}/api/messages/${id}`);
      // console.log(response.data.messages);
      if (showPreviousMessages == "true") {

        setMessages(response.data.messages)
      }

    } catch (err) {
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

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
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;

    if (input.trim() && name) {
      const messageData = { text: input, name, id, email: user.primaryEmailAddress.emailAddress, room: selectedRoom?.name };
      socket.emit('roomMessage', messageData);
      setMessages((prev) => [...prev, { text: input, name, isOwn: true }]);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!socket || !name || !id) return;

    socket.emit('roomTyping', { user: name, roomId: id });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit('roomStopTyping', { user: name, roomId: id });
    }, 1000);

    setTypingTimeout(timeout);
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
      // console.log(err);
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
      // console.log('Joined room:', response.data);
    } catch (err) {
      // console.log('Error joining room:', err);
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
    <div className="w-full max-w-2xl bg-white rounded-lg flex flex-col h-[78vh] mx-auto pt-0 px-2">
      <div className=" text-blue-500 p-2 rounded-t-lg flex flex-wrap justify-between items-center">
        <h2 className="text-lg font-semibold">{selectedRoom?.name}</h2>
        <div className="flex space-x-2 text-white">
          <span className="bg-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <FaUserGroup /> {selectedRoom?.members?.length}
          </span>
          <span className="bg-green-700 px-3 py-1 rounded-full text-sm">
            {activeUsers} On
          </span>
        </div>
      </div>
      <hr />
      {showPreviousMessages != "true" ? <Link className='text-blue-500 flex items-center gap-1' href={'/profile'}><TbHandClick/>Turn on previous messages from profile.</Link> : ""}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.email == user.primaryEmailAddress.emailAddress || msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs">
              <div
                className={`p-3 rounded-lg min-w-40 shadow ${msg.email == user.primaryEmailAddress.emailAddress || msg.isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
              >
                <div className={`text-xs flex justify-between opacity-80 font-semibold mb-1 ${msg.email == user.primaryEmailAddress.emailAddress || msg.isOwn ? 'text-white' : 'text-gray-500'}`}>
                  <span> {msg.name}</span>
                </div>

                <hr />
                <p className="text-base">{msg.text}</p>
                <p className="text-xs text-right opacity-80 font-semibold"><LiveTimeAgo timestamp={msg?.timestamp} /></p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-4 py-2 fixed bottom-0 left-0 w-full">
        <div className="max-w-2xl m-auto">
          {/* Typing Feedback */}
          <div className="min-h-[20px]">
            {typingUsers.length > 0 && (
              <p className="italic py-2 text-sm text-gray-500">
                {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
              </p>
            )}
          </div>
          <div className="flex items-center w-full m-auto">
            <input
              type="text"
              ref={inputRef}
              autoFocus
              value={input}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 border border-blue-500 rounded-l-lg focus:outline-none"
              placeholder={`${name} Type a message...`}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 border border-blue-500 text-white p-2 px-6 rounded-r-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;