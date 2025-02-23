'use client'; // Add this directive to make it a Client Component

import React, { useState, useEffect } from 'react';

const Page = () => {
    const [name, setName] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Run only on client side after mount
    useEffect(() => {
        setIsMounted(true);
        // Only access localStorage after component mounts on client
        const storedName = localStorage.getItem('chatName') || '';
        setName(storedName);
    }, []);

    // Update localStorage when name changes (only on client)
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('chatName', name);
        }
    }, [name, isMounted]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    // Don't render anything until mounted on client to avoid hydration mismatches
    if (!isMounted) {
        return null; // or a loading state if preferred
    }

    return (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[90vh] mx-auto pt-2 px-2">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 rounded-t-lg">
                <h2 className="text-lg font-semibold">Profile</h2>
            </div>

            {/* Name Input Section */}
            <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="nameInput" className="text-gray-700 font-medium">
                        Your Name
                    </label>
                    <span className='opacity-50'>Just type it will be auto save.</span>
                    <input
                        id="nameInput"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter your name"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;