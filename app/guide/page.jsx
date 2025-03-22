import React from 'react';
import Link from 'next/link'; // Import Link from next/link for Next.js navigation

const Page = () => {
  return (
    <div className='w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[90vh] mx-auto pt-6 px-6 overflow-y-auto'>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">User Guide</h1>

      {/* Global Chat Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          🌐 Global Chat <Link href="/" className="ml-2 text-blue-500 hover:text-blue-700">🔗</Link>
        </h2>
        <p className="text-gray-700 mb-2">
          The <strong>Global Chat</strong> is a public space where you can chat with anyone without needing to log in. It's perfect for open discussions and meeting new people.
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li><strong>Access:</strong> Visit the homepage to start chatting.</li>
          <li><strong>No login required:</strong> Anyone can join and start chatting immediately.</li>
          <li><strong>Real-time messaging:</strong> Chat with all users in real-time.</li>
        </ul>
      </section>

      {/* Rooms Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          🚪 Rooms <Link href="/rooms" className="ml-2 text-blue-500 hover:text-blue-700">🔗</Link>
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Rooms</strong> are private group chats that require you to log in. You can create your own room, share it with others, and enjoy private conversations.
        </p>
        <h3 className="text-lg font-medium mb-2">How to Use Rooms:</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li><strong>Create a Room:</strong> Go to the Rooms page and click on the <strong>Create Room</strong> button.</li>
          <li><strong>Join a Room:</strong> Use the shared room link to join a private group.</li>
          <li><strong>Room Features:</strong>
            <ul className="list-circle list-inside ml-6">
              <li>Display previous messages (can be turned off in profile settings).</li>
              <li>Private and secure—only users with the room link can join.</li>
              <li>Shareable links for easy access.</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* Profile Settings Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          👤 Profile Settings <Link href="/profile" className="ml-2 text-blue-500 hover:text-blue-700">🔗</Link>
        </h2>
        <p className="text-gray-700 mb-2">
          Your <strong>Profile</strong> is where you can manage your account and personalize your chat experience.
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li><strong>Change Your Name:</strong> Update your display name anytime.</li>
          <li><strong>Message History:</strong> Toggle the display of previous messages in rooms on or off.</li>
        </ul>
      </section>

      {/* Quick Tips Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">💡 Quick Tips</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Use <strong>Global Chat</strong> for casual, open conversations.</li>
          <li>Use <strong>Rooms</strong> for focused, private discussions.</li>
          <li>Regularly update your profile settings for a personalized experience.</li>
        </ul>
      </section>

     
    </div>
  );
};

export default Page;