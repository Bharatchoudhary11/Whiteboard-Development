const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/roomRoutes');
const socketHandler = require('./socket/socketHandler');

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
app.use(cors());              // Allow all origins
app.use(express.json());      // Parse JSON bodies

// Routes
app.use('/api/rooms', roomRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/whiteboard')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.io handler
socketHandler(io);

// Server listen
const PORT = process.env.PORT || 5001; // 🔁 Use 5000 to match frontend
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
