import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;  

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// For server health check
app.get("/healthz", (_req, res) => {
  res.send("OK");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
