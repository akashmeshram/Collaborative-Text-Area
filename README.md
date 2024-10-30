# Collaborative Text Area

This project is a simple WebSocket server built using Express and the `ws` library. It allows clients to connect, send messages, and manage shared text input with locking functionality. The server tracks active clients and handles connections gracefully, ensuring only one client can edit the shared text at a time.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Client Implementation](#client-implementation)
- [Contributing](#contributing)
- [License](#license)

## Features

- WebSocket connection handling for real-time communication.
- Text input area shared among clients with locking mechanism.
- Health check endpoint for server status.
- Static file serving from a public directory.
- Handles multiple client connections and disconnections gracefully.

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install
   ```

3. **Run the server:**

   ```bash
   npm start
   ```

   The server will start and listen on the specified port (default is 5000).

## Usage

Once the server is running, you can access the application by navigating to `http://localhost:5000` in your web browser. The static HTML file provides a text area for input and a button to test the WebSocket connection.

## API Endpoints

- `GET /healthz`  
  Returns a simple "OK" message to indicate that the server is running.

- `GET /check-connection`  
  Returns a JSON response `{ status: "success" }` to test the WebSocket connection.

## Client Implementation

The client-side is a simple HTML page that connects to the WebSocket server. It features:

- A text area for shared input.
- A button to test the WebSocket connection.
- Logic to handle focus, input changes, and blur events for locking and unlocking the text area.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

