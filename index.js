import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express(); // Create an Express application
const server = http.createServer(app); // Create an HTTP server
const wss = new WebSocketServer({ server }); // Create a WebSocket server
const PORT = process.env.PORT || 5000; // Set the port for the server

// Server state to manage text and lock status
const areaState = {
    text: "",
    lock: false,
};

// Track active clients
const activeClients = new Set(); // Store active clients

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get("/healthz", (_req, res) => {
    res.send("OK"); // Respond with a simple message
});

// Endpoint to test WebSocket connection
app.get("/check-connection", (_req, res) => {
    res.send({ status: "success" }); // Respond with success status
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log("Client Socket Connected to the server");
    
    // Send initial state to the newly connected client
    ws.send(JSON.stringify({ type: 'initial', ...areaState }));

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        const msg = JSON.parse(message); // Parse the received message

        // Handle lock request
        if (msg.type === 'lock' && !areaState.lock) {
            areaState.lock = true; // Lock the area
            ws.active = true; // Mark this WebSocket as active
            sendSocketMessage({ type: 'lock', locked: true }); // Notify all clients about the lock
        } else
        // Handle text changes
        if (msg.type === 'text' && ws.active) {
            areaState.text = msg.text; // Update the text in the server state
            sendSocketMessage({ type: 'text', text: areaState.text }); // Notify all clients about the new text
        } else
        // Handle unlock request on blur
        if (msg.type === 'unlock' && ws.active) {
            areaState.lock = false; // Unlock the area
            ws.active = false; // Mark this WebSocket as inactive
            sendSocketMessage({ type: 'lock', locked: false }); // Notify all clients about the unlock
        } else {
          sendSocketMessage({type: "message", ...msg})
        }
    });

    // Handle WebSocket closure
    ws.on('close', () => {
      console.log("Client Socket Disconnected from the server");
      // Check if the disconnected client was active
      if (ws.active) {
          activeClients.delete(ws); // Remove from active clients
          // If no active clients remain, allow the next client to be active
          if (activeClients.size === 0) {
              console.log("No active clients left, the next client can take the lock.");
          }
      }
    });
});

// Function to broadcast messages to all connected clients
function sendSocketMessage(data = {}) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data)); // Send the data as a JSON string
        }
    });
}

// Start the server and listen for incoming requests
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
