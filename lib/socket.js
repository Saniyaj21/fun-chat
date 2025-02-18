import { io } from 'socket.io-client';

const socket = io('https://fun-chat-server.vercel.app/'); // Replace with your backend URL

export default socket;