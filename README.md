# Group Chat System

This is a **Group Chat System** that allows users to join groups and chat in real-time. The system consists of a **client side** built with **React.js** and a **server side** built with **Node.js/Express**.

The app allows users to:
- Register and log in using JWT authentication.
- Join different groups.
- Send and receive messages in real-time.
- View group chat history.

## Project Structure

- **Client Side**: A React-based frontend that interacts with the backend API and provides a real-time messaging experience using **Socket.io**.
- **Server Side**: A Node.js backend built with **Express.js**, **Socket.io**, and **MongoDB** for storing user and group data.

## Installation

Follow the respective instructions for setting up the **client side** and **server side**.

### Client Side Setup

1. Clone the repository and follow the instructions in the [Client Side README](./client-side/README.md).

### Server Side Setup

1. Clone the repository and follow the instructions in the [Server Side README](./server-side/README.md).

## Technologies

- **Frontend**: React, TypeScript, Material-UI, Redux, Socket.io-client.
- **Backend**: Node.js, Express.js, MongoDB, Socket.io, JWT.

## Run Both Locally

1. Start the server:
    ```bash
    npm start
    ```

2. Start the client:
    ```bash
    npm start
    ```

Now you can use the **Group Chat System** locally.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Open a pull request.
