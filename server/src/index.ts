import { connectToMongo } from './services/database.service';
import { Express } from 'express';
import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { apiRateLimiter } from './rateLImiter';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http'; // Import the HTTP module
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.io

import { setupSwagger } from './swagger';

dotenv.config(); // Load environment variables

// Connect to MongoDB
connectToMongo();

// Create an Express app
const app: Express = express();

// Set up middleware and routes
app.use(cors());
app.use(apiRateLimiter);
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api', routes);

// Create an HTTP server from the Express app
const server = http.createServer(app); 
setupSwagger(app);

// Set up Socket.io with the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend URL (adjust if necessary)
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // Check if this prints
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Event: Join a group
  socket.on('joinGroup', (groupId: string) => {
    socket.join(groupId); // Join a room based on group ID
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Event: Send a message in a group
  socket.on('sendMessage', (data: { groupId: string, message: string }) => {
    io.to(data.groupId).emit('receiveMessage', data.message); // Emit to all users in the room
    console.log(`Message sent to group ${data.groupId}:`, data.message);
  });

  // Event: Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Example of a test route
app.get('/', (req, res) => {
  res.send('Socket.io Integrated!');
});

// Start the server on the specified port
server.listen(process.env.PORT || 8000, () => {
  console.log('Server is listening at the Port:', process.env.PORT || 8000);
  console.log('Server is at port: http://localhost:8000 and Swagger at: http://localhost:8000/api-docs');
});
