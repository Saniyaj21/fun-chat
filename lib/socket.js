import { io } from 'socket.io-client';

// const socket = io('http://localhost:8080'); // Replace with your backend URL
const socket = io('https://fun-chat-server.vercel.app'); // Replace with your backend URL

export default socket;