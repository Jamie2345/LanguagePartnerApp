import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { authenticateToken } from "./middleware/auth.middleware.js";

import authRoutes from "./routes/authRoutes.js";

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

app.listen(5000, () => {
  console.log("listening on port 5000");
});

app.set("trust proxy", true);

app.use("/api/auth", authRoutes);

// remove password from data before sending it back to client
const sanitiseResponse = (data) => {
  const sanitisedObj = {...data}
  delete sanitisedObj.password;
  return sanitisedObj
}

app.get("/api/protected", authenticateToken, async (req, res) => {
  return res
    .status(200)
    .json({ message: "You are authenticated", user: req.user });
});

app.get("/api/user", authenticateToken, async (req, res) => {
  const user = sanitiseResponse(req.user);
  return res.status(200).json({user: user});
});

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000");
});
