import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = ({ color = 'black', strokeWidth = 2, onClear, socket, roomId }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    contextRef.current = context;
  }, []);

  // Handle clear canvas from other users
  useEffect(() => {
    if (!socket) return;

    const handleClear = () => {
      clearCanvas();
    };

    socket.on('clear-canvas', handleClear);

    return () => {
      socket.off('clear-canvas', handleClear);
    };
  }, [socket]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setDrawing(true);

    socket?.emit('draw-start', { x: offsetX, y: offsetY, color, strokeWidth, roomId });
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket?.emit('draw-move', { x: offsetX, y: offsetY, roomId });
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setDrawing(false);
    socket?.emit('draw-end', { roomId });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (onClear) {
      onClear.current = () => {
        clearCanvas();
        socket?.emit('clear-canvas', { roomId });
      };
    }
  }, [onClear, socket, roomId]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      style={{
        border: '2px solid #e5e7eb',
        backgroundColor: 'white',
        cursor: 'crosshair',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
  );
};

export default DrawingCanvas;
