import { io } from 'socket.io-client';
//  export const backendURL = 'https://fun-chat-server-hrde.onrender.com';
 export const backendURL = 'http://localhost:8080';



const socket = io(backendURL); // Replace with your backend URL
// const socket = io('https://fun-chat-server-hrde.onrender.com'); // Replace with your backend URL

export default socket;