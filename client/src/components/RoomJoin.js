import React, { useState } from 'react';
import axios from 'axios';

const RoomJoin = ({ onJoin }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!roomCode) return;
    try {
      await axios.post('http://localhost:5001/api/rooms/join', { roomId: roomCode });
      onJoin(roomCode);
    } catch (err) {
      setError('Error joining room. Please try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Join Whiteboard</h2>
      <input
        style={styles.input}
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room Code"
      />
      <button style={styles.button} onClick={handleJoin}>Join</button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '15vh',
    gap: '1rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    width: '250px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  }
};

export default RoomJoin;
