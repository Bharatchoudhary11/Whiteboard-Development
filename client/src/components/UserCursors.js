import React from 'react';

const UserCursors = ({ cursors }) => {
  return (
    <>
      {Object.entries(cursors).map(([userId, { x, y }]) => (
        <div
          key={userId}
          style={{
            position: 'absolute',
            left: x + 5,
            top: y + 5,
            width: 10,
            height: 10,
            backgroundColor: 'red',
            borderRadius: '50%',
            zIndex: 999,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

export default UserCursors;
