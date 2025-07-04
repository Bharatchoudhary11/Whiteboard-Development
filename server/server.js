const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/roomRoutes');
const socketHandler = require('./socket/socketHandler');
require('dotenv').config(); // Load .env variables

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);

// MongoDB connection using .env URI
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.io logic
socketHandler(io);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
