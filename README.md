# Group Chat System

The **Group Chat System** is a real-time chat application where users can join groups, send and receive messages, and view group details. The project is built with a **React.js** frontend and a **Node.js/Express** backend, using **Socket.io** for real-time communication and **MongoDB** for data storage.

---

## Features

### General Features:
- **User Authentication**: Secure login and signup using JWT.
- **Real-Time Messaging**: Send and receive messages instantly via **Socket.io**.
- **Group Management**: Users can join groups and view group details.
- **Message History**: Retrieve and display chat history for each group.
- **Responsive Design**: Frontend designed for both desktop and mobile devices.

### Frontend:
- **Interactive UI**: Built using **React.js**, **Material-UI**, and **Framer Motion** for animations.
- **State Management**: Handled using **Redux Toolkit** with `redux-persist` for persistent states.
- **Dynamic Routing**: Implements dynamic group-based navigation.

### Backend:
- **Scalable REST API**: Developed with **Express.js** to handle all business logic.
- **Real-Time Communication**: Powered by **Socket.io** for WebSocket communication.
- **MongoDB**: Stores user data, group data, and message history.

---

## Technologies Used

### Frontend:
- **React.js** and **TypeScript**
- **Material-UI** (MUI)
- **Redux Toolkit** (RTK)
- **Framer Motion** for animations
- **Socket.io-client**

### Backend:
- **Node.js** with **Express.js**
- **MongoDB** for database
- **Socket.io** for WebSocket communication
- **JWT** for authentication
- **Swagger** for API documentation

---

## Project Structure

group-chat-system/ ├── client/ # Frontend code (React.js) ├── server/ # Backend code (Node.js/Express) ├── .env # Environment variables ├── package.json # Project metadata and dependencies ├── README.md # Project documentation


---

## Installation and Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (or yarn)
- MongoDB (running locally or a cloud instance like MongoDB Atlas)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/group-chat-system.git
2. .env setup
 MONGO_URI=mongodb://localhost:27017/groupchat
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:3000
SOCKET_PORT=5173


#API DOCUMENTATION

http://localhost:8000/api-docs

Available Features
**User Routes
**POST /user/signup - Register a new user.
POST /user/login - Authenticate a user.
**POST /user/refresh-token - Refresh JWT tokens.
Group Routes
GET /group - Fetch all available groups.
GET /group/:id - Get group details by ID.
Chat Routes
GET /group/:id/messages - Fetch chat messages for a group.
POST /group/:id/messages - Send a message to a group.

