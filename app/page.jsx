'use client';

import Chat from '@/components/Chat';
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}

      {/* Main Content */}
      <main className="flex-1 flex items-end justify-center px-2">
        <Chat />
      </main>
    </div>
  );
};

export default Page;