'use client';

import { useState, useEffect } from 'react';

const MessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://fun-chat-server-hrde.onrender.com/api/messages/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setMessages(data.messages);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Format timestamp to human-readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short', // e.g., "Feb"
      day: '2-digit', // e.g., "22"
      year: 'numeric', // e.g., "2025"
      hour: '2-digit', // e.g., "10"
      minute: '2-digit', // e.g., "40"
      hour12: true, // e.g., "AM/PM"
    });
  };

  if (loading) {
    return <div className="text-center p-4 text-blue-500">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[90vh] mx-auto my-4">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">Message History</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex mb-4 justify-start'
                }`}
            >
              <div className="max-w-xs">
                <div
                  className={`p-3 rounded-lg shadow bg-white text-gray-800 border border-gray-200'
                    }`}
                >
                  {/* Name - Show for all messages */}
                  <div
                    className={`text-xs font-semibold mb-1 text-gray-500'
                      }`}
                  >
                    {msg.name}  <span className='opacity-50'>[{formatDate(msg.timestamp)}]</span>
                  </div>
                  {/* Message */}
                  <p className="text-base">{msg.text}</p>
                  {/* Timestamp */}
                  {/* <span
                    className={`text-xs block mt-1 text-gray-500'
                      }`}
                  >
                    {formatDate(msg.timestamp)}
                  </span> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageHistory;