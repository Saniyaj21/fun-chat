'use client';

import React, { useState, useEffect } from 'react';
import { MdDeleteSweep } from "react-icons/md";
import Link from 'next/link';
import axios from 'axios';
import { backendURL } from '@/lib/socket';
import { useUser } from '@clerk/nextjs';
import UserGuideLink from '@/components/UserGuideLink';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedRoomId, setCopiedRoomId] = useState(null);

  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load
    if (!isSignedIn) {
      setError('Please sign in to view your rooms');
      setLoading(false);
      return;
    }
    fetchRooms();
  }, [isLoaded, isSignedIn, user]); // Depend on user loading state

  const fetchRooms = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) throw new Error('User email not available');
      console.log('Fetching rooms for:', email);

      const response = await axios.get(`${backendURL}/api/rooms/member/${email}`);
      if (response.data.success) {
        setRooms(response.data.rooms);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.trim() || !isSignedIn) return;
    try {
      const response = await axios.post(`${backendURL}/api/rooms`, {
        name: newRoom,
        creator_email: user?.primaryEmailAddress?.emailAddress,
      });
      if (response.data.success) {
        setRooms([response.data.room, ...rooms]);
        setNewRoom('');
      } else {
        throw new Error('Failed to create room');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const deleteRoom = async (id) => {

    try {

      if (confirm("Delete this room?")) {
        const response = await axios.delete(`${backendURL}/api/rooms/${id}`)
        if (response.data.success) {
          fetchRooms()
        } else {
          throw new Error('Failed to create room');
        }
      }
    }

    catch (err) {
      setError(err.message);
    }
  };

  const shareLink = (roomId) => {
    const url = `${window.location.origin}/rooms/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedRoomId(roomId);
      setTimeout(() => setCopiedRoomId(null), 5000);
    });
  };

  if (!isLoaded) return <div className="text-center p-4 text-blue-500">Loading user data...</div>;
  if (loading) return <div className="text-center p-4 text-blue-500">Loading rooms...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[90vh] mx-auto pt-2 px-2">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">Your Rooms</h2>
      </div>

      {/* Create Room Input */}
      <form onSubmit={createRoom} className="p-4 border-b border-blue-200">
        <div className="flex items-center">
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter room name..."
            className="flex-1 p-2 border border-blue-400 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 px-4 rounded-r-lg hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </form>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto p-4 bg-blue-50">
        {rooms.length === 0 ? (
          <>
            <p className="text-center text-blue-400 opacity-50">No rooms found. Create one to start chatting!</p>
            <UserGuideLink />
          </>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="bg-blue-100 rounded-lg shadow p-2 mb-2">
              <Link href={`/rooms/${room._id}`} className="block">
                <div className="p-3 bg-blue-200 rounded-lg shadow hover:bg-blue-300 transition">
                  <h3 className="text-base font-semibold text-blue-800">{room.name}</h3>
                  <p className="text-xs text-blue-500 opacity-75">Members: {room?.members?.length}</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => deleteRoom(room._id)}
                  className="bg-red-500 mr-4 text-white px-3 py-1 rounded-full text-xl hover:bg-red-600 transition"
                >
                  <MdDeleteSweep />
                </button>
                <button
                  onClick={() => shareLink(room._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition"
                >
                  Copy Link
                </button>

                {copiedRoomId === room._id && (
                  <span className="text-xs text-blue-600 opacity-75">Link Copied, Share now.</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;