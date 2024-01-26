// App.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('/');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      body: message,
      from: 'Me',
    };

    setMessages([...messages, newMessage]);
    socket.emit('message', message);

    setMessage('');
  };

  useEffect(() => {
    socket.on('message', receiveMessage);
    socket.on('loadMessages', loadMessages);

    return () => {
      socket.off('message', receiveMessage);
      socket.off('loadMessages', loadMessages);
    };
  }, []);

  const receiveMessage = (message) => {
    setMessages((state) => [...state, message]);
  };

  const loadMessages = (messages) => {
    setMessages(messages);
  };

  return (
    <>
      <div className=' relative h-screen bg-zinc-900 text-white flex items-center justify-center'>
        <form onSubmit={handleSubmit} className='relative bg-zinc-800 h-[90%] p-10'>
          <h1 className='text-2xl font-bold my-2 border-b-2'>CHAT MESSAGES</h1>
          <input className='border-2 text-black  border-zinc-500 p-2 absolute bottom-10' type="text" placeholder='Escribe tu mensaje ' onChange={(e) => setMessage(e.target.value)} />

          <ul>
            {messages.map((message, index) => (
              <li key={index} className={`my-2 p-2 table rounded-md bg-sky-700 ${message.from === 'Me' ? 'bg-sky-700' : 'bg-[#0002] ml-auto'}`}>
                <span className='text-xs font-bold text-slate-300'>{message.from}</span>: <span className='text-sm'>{message.body}</span>
              </li>
            ))}
          </ul>
        </form>
      </div>
    </>
  );
}

export default App;
