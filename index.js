import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;  

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
