import React, { useState, useRef, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import { io } from 'socket.io-client';

const Whiteboard = ({ roomId }) => {
  const [color, setColor] = useState('black');
  const [stroke, setStroke] = useState(2);
  const clearRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);
    newSocket.emit('join-room', roomId);

    newSocket.on('cursor-update', ({ userId, x, y }) => {
      setCursors((prev) => ({
        ...prev,
        [userId]: { x, y },
      }));
    });

    newSocket.on('user-left', (userId) => {
      setCursors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    let sendCursor;
    if (socket) {
      sendCursor = (e) => {
        if (socket && socket.connected) {
          socket.emit('cursor-move', {
            x: e.clientX,
            y: e.clientY,
            roomId,
          });
        }
      };
      window.addEventListener('mousemove', sendCursor);
    }
    return () => {
      if (sendCursor) {
        window.removeEventListener('mousemove', sendCursor);
      }
    };
  }, [socket, roomId]);

  const handleClear = () => {
    if (clearRef.current) clearRef.current();
  };

  return (
    <>
      <Toolbar
        color={color}
        setColor={setColor}
        stroke={stroke}
        setStroke={setStroke}
        onClear={handleClear}
      />
      {socket && (
        <>
          <DrawingCanvas
            color={color}
            strokeWidth={stroke}
            onClear={clearRef}
            socket={socket}
            roomId={roomId}
          />
          <UserCursors cursors={cursors} />
        </>
      )}
    </>
  );
};

export default Whiteboard;