const Room = require('../models/Room');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    let currentRoomId = null;

    socket.on('join-room', async (roomId) => {
      currentRoomId = roomId;
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('draw-start', async (data) => {
      io.to(data.roomId).emit('draw-start', data);

      await Room.updateOne(
        { roomId: data.roomId },
        {
          $push: {
            drawingData: {
              type: 'stroke',
              data: {
                action: 'start',
                x: data.x,
                y: data.y,
                color: data.color,
                strokeWidth: data.strokeWidth
              },
              timestamp: new Date()
            }
          },
          $set: { lastActivity: new Date() }
        }
      );
    });

    socket.on('draw-move', async (data) => {
      io.to(data.roomId).emit('draw-move', data);

      await Room.updateOne(
        { roomId: data.roomId },
        {
          $push: {
            drawingData: {
              type: 'stroke',
              data: {
                action: 'move',
                x: data.x,
                y: data.y
              },
              timestamp: new Date()
            }
          },
          $set: { lastActivity: new Date() }
        }
      );
    });

    socket.on('draw-end', async (data) => {
      io.to(data.roomId).emit('draw-end', data);

      await Room.updateOne(
        { roomId: data.roomId },
        {
          $push: {
            drawingData: {
              type: 'stroke',
              data: {
                action: 'end'
              },
              timestamp: new Date()
            }
          },
          $set: { lastActivity: new Date() }
        }
      );
    });

    socket.on('clear-canvas', async (data) => {
      io.to(data.roomId).emit('clear-canvas');

      await Room.updateOne(
        { roomId: data.roomId },
        {
          $push: {
            drawingData: {
              type: 'clear',
              data: {},
              timestamp: new Date()
            }
          },
          $set: { lastActivity: new Date() }
        }
      );
    });

    socket.on('cursor-move', ({ x, y, roomId }) => {
      socket.to(roomId).emit('cursor-update', {
        userId: socket.id,
        x,
        y,
      });
    });

    socket.on('disconnect', () => {
      if (currentRoomId) {
        socket.to(currentRoomId).emit('user-left', socket.id);
      }
    });
  });
};

module.exports = socketHandler;
