import React from 'react';

const Toolbar = ({ color, setColor, stroke, setStroke, onClear }) => {
  return (
    <div style={styles.toolbar}>
      <label>
        Color:
        <select value={color} onChange={(e) => setColor(e.target.value)} style={styles.select}>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </label>

      <label>
        Stroke Width:
        <input
          type="range"
          min="1"
          max="10"
          value={stroke}
          onChange={(e) => setStroke(Number(e.target.value))}
          style={styles.slider}
        />
      </label>

      <button onClick={onClear} style={styles.clearBtn}>Clear</button>
    </div>
  );
};

const styles = {
  toolbar: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ffffffdd',
    padding: '10px',
    borderRadius: '8px',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    zIndex: 1000,
  },
  select: {
    marginLeft: '0.5rem',
  },
  slider: {
    marginLeft: '0.5rem',
  },
  clearBtn: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Toolbar;
