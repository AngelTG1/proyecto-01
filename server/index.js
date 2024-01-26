import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import mysql from 'mysql2'; 

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  transports: ['polling'],
});

// Create a MySQL connection pool
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'Angel',
  password: '1980',
  database: 'chats',
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('message', (body) => {
    // Store message in database
    db.query('INSERT INTO messages (body, sender_id) VALUES (?, ?)', [body, socket.id.slice(6)], (err, results) => {
      if (err) {
        console.error('Error saving message to database:', err);
      } else {
        console.log('Message saved to database:', results);
      }
    });

    

    // Send message to all clients
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(6),
    });
  });
});

server.listen(3000, () => {
  console.log("Server on port ", 3000);
});
