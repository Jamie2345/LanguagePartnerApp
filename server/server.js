import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

import http from "http"; // Import HTTP for server
import { Server } from "socket.io"; // Import Socket.IO

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Connect to mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;

db.once("open", () => console.log("Successfully connected to MongoDB"));
db.on("error", (e) => console.log(e));

app.set("trust proxy", true);

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // prevent cors issues with websocket.
  },
});

// WebSocket server
io.on("connection", (socket) => {
  console.log("New WebSocket user connected");

  // Join a room (room name will be the conversationId sent from client)
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  // Send an update signal to all other users (which will then be detected on client side and trigger messages to be fetched via API.)
  socket.on("update", (roomName) => {
    socket.to(roomName).emit("updateReceived");
    console.log(`Update signal sent in room ${roomName}`);
  });

  // when the client disconnects
  socket.on("disconnect", () => {
    console.log("WebSocket user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on port 5000");
});

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000");
});
