const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// POST /api/rooms/join
router.post('/join', async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId || roomId.length < 6 || roomId.length > 8) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }

    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({ roomId });
      await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error('Error in /join:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error('Error in /:roomId:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
