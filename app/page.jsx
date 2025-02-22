'use client';

import Chat from '@/components/Chat';
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ChatSphere</h1>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-200 transition">Home</a>
            <a href="#" className="hover:text-blue-200 transition">About</a>
            <a href="#" className="hover:text-blue-200 transition">Logout</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Chat />
      </main>
    </div>
  );
};

export default Page;