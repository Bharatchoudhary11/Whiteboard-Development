import React, { useState } from 'react';
import axios from 'axios';

const RoomJoin = ({ onJoin }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!roomCode.trim()) return;

    try {
      // ✅ Switch between local and production URLs
      const apiURL =
        process.env.REACT_APP_API_BASE_URL ||
        'https://whiteboard-development.onrender.com';

      await axios.post(`${apiURL}/api/rooms/join`, { roomId: roomCode });
      onJoin(roomCode);
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Error joining room. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter Room Code</h2>
      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="e.g. AB12CD"
        style={styles.input}
      />
      <button onClick={handleJoin} style={styles.button}>Join Room</button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
  },
  input: {
    padding: '10px',
    width: '200px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#007BFF',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  }
};

export default RoomJoin;
