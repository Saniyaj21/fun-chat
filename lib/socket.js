import { io } from 'socket.io-client';
 export const backendURL = 'https://fun-chat-server-hrde.onrender.com';



const socket = io(backendURL); // Replace with your backend URL
// const socket = io('https://fun-chat-server-hrde.onrender.com'); // Replace with your backend URL

export default socket;