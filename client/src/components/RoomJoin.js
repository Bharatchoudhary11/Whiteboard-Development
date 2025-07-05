import React, { useState } from 'react';
import axios from 'axios';

const RoomJoin = ({ onJoin }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError('Room code cannot be empty');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const apiURL = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:5001';

      const response = await axios.post(`${apiURL}/api/rooms/join`, {
        roomId: roomCode.trim(),
      });

      if (response.status === 200) {
        onJoin(roomCode.trim());
      } else {
        setError('Could not join room. Try again.');
      }
    } catch (err) {
      console.error('Failed to join room:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Join a Whiteboard Room</h2>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room ID (e.g. abc123)"
        style={styles.input}
      />
      <button onClick={handleJoin} style={styles.button} disabled={loading}>
        {loading ? 'Joining...' : 'Join Room'}
      </button>
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
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '250px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 18px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default RoomJoin;
