
---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/Bharatchoudhary11/Whiteboard-Development
cd whiteboard-app

```
### Start the Backend
- cd server
- npm install
- node server.js


- Runs at http://localhost:5001
- Ensure MongoDB is running on mongodb://localhost:27017

### Start the Frontend

- cd client
- npm install
- npm start

- Runs at http://localhost:3010


```API Documentation
POST	/api/rooms/join
GET   	/api/rooms/:roomId

```

### Architecture Overview
- Frontend: Handles canvas rendering, UI, and socket events.

- Backend: Manages room creation, WebSocket communication, and MongoDB persistence.

- MongoDB: Stores room metadata and drawing data for future session restore.

- Socket.io: Enables real-time drawing sync and user presence tracking.