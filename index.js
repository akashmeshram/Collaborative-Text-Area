import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 5000;

// Server State
const areaState = {
    text: "",
    lock: false,
};

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// For server health check
app.get("/healthz", (_req, res) => {
    res.send("OK");
});

// Send test message to WebSocket
app.get("/check-connection", (_req, res) => {
    // Respond to the client
    res.send({ status: "success" });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log("Client Socket Connected to the server");
    ws.send(JSON.stringify({ type: 'initial', ...areaState }));

    ws.on('message', (message) => {
        const msg = JSON.parse(message);

        // Handle lock request
        if (msg.type === 'lock' && !areaState.lock) {
            areaState.lock = true;
            ws.active = true;
            sendSocketMessage({ type: 'lock', locked: true });
        }

        // Handle text changes
        if (msg.type === 'text' && ws.active) {
            areaState.text = msg.text;
            sendSocketMessage({ type: 'text', text: areaState.text });
        }

        // Handle unlock request on blur
        if (msg.type === 'unlock' && ws.active) {
            areaState.lock = false;
            ws.active = false;  // Mark this client as inactive
            sendSocketMessage({ type: 'lock', locked: false });
        }
    });

    ws.on('close', () => {
      console.log("Client Socket Disconnected from the server");
    });
});

// Broadcast a message to all connected clients
function sendSocketMessage(data = {}) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
