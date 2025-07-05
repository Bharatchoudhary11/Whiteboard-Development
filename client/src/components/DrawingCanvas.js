import React, { useRef, useEffect, useState } from 'react';

const DrawingCanvas = ({ color = 'black', strokeWidth = 2, onClear, socket, roomId }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // Initialize canvas
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
}, []); // ✅ clean now


  // Update color & stroke dynamically
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = strokeWidth;
    }
  }, [color, strokeWidth]);

  // Socket drawing listeners
  useEffect(() => {
    if (!socket) return;

    const handleDrawStart = ({ x, y }) => {
      const ctx = contextRef.current;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleDrawMove = ({ x, y, color, strokeWidth }) => {
      const ctx = contextRef.current;
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handleClear = () => {
      clearCanvas();
    };

    socket.on('draw-start', handleDrawStart);
    socket.on('draw-move', handleDrawMove);
    socket.on('clear-canvas', handleClear);

    return () => {
      socket.off('draw-start', handleDrawStart);
      socket.off('draw-move', handleDrawMove);
      socket.off('clear-canvas', handleClear);
    };
  }, [socket]);

  // Start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);

    socket?.emit('draw-start', { x: offsetX, y: offsetY, roomId });
  };

  // Draw on canvas
  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket?.emit('draw-move', {
      x: offsetX,
      y: offsetY,
      color,
      strokeWidth,
      roomId,
    });
  };

  // Finish drawing
  const finishDrawing = () => {
    if (!drawing) return;
    contextRef.current.closePath();
    setDrawing(false);
  };

  // Clear canvas locally
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Assign clear handler to ref from parent
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
      onMouseMove={draw}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        cursor: 'crosshair',
        zIndex: 1,
      }}
    />
  );
};

export default DrawingCanvas;
