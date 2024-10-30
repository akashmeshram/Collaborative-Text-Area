import express from "express";
import http from "http";
import WebSocket, { WebSocketServer }  from "ws";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 5000;  

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// For server health check
app.get("/healthz", (_req, res) => {
  res.send("OK");
});

// Send test message to webcoket
app.get("/check-connection", (_req, res) => {
  sendSocketMessage({type: "test_message", content: "test message"});
  res.send({status: "success"});
});


wss.on('connection', () => {
  console.log("Socket Connected to the server");
});

wss.on('close', () => {
  console.log("Socket Disconnected from the server");
});


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
