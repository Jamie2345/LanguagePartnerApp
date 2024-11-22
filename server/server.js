import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
dotenv.config();

import { ExpressAuth } from "@auth/express";
//import { CredentialsSignin } from "@auth/express";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db.js";
import Credentials from "@auth/express/providers/credentials";
import saltHashPassword from "./utils/hashPassword.js";

import bcrypt from "bcrypt";

import User from "./models/User.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("test");
console.log(process.env.MONGODB_URI);

// Connect to mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;

db.once("open", () => console.log("Successfully connected to MongoDB"));
db.on("error", (e) => console.log(e));

app.get("/api", (req, res) => {
  res.json({ message: "Hello World! from api" });
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});

app.set("trust proxy", true);

app.post("/api/auth/register", async (req, res) => {
  console.log(req.body);
  try {
    if (req.body && req?.body.password && req?.body.username) {
      const hashedPassword = await saltHashPassword(req.body.password);
      console.log(hashedPassword);
      console.log(typeof hashedPassword);
      if (hashedPassword) {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        user
          .save()
          .then((savedUser) => {
            return res.json(savedUser);
          })
          .catch((error) => {
            console.log(error);
            if (error?.code === 11000) {
              return res
                .status(409)
                .json({ error: "A user with this username already exists." });
            }
            return res
              .status(400)
              .json({ error: "an unexpected error occured" });
          });
      } else {
        return res.status(400).json({ error: "an unexpected error occured" });
      }
    } else {
      return res.status(400).json({
        error: "Bad request, please provide both username and password.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unexpected internal server error" });
  }
});

app.use(
  "/api/auth/*",
  ExpressAuth({
    trustHost: true,
    providers: [
      Credentials({
        credentials: {
          username: { label: "Username" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          console.log(credentials);
          if (credentials && credentials?.username && credentials?.password) {
            console.log("valid creds");
            const user = await User.findOne({ username: credentials.username });
            if (!user) {
              throw new Error("Invalid credentials.");
            }
            // compare the hashes
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            console.log(isMatch);
            if (!isMatch) {
              throw new Error("Invalid credentials.");
            }
            console.log(user);
            return user;
          }
          throw new Error("Invalid credentials.");
        },
      }),
    ],
    adapter: MongoDBAdapter(client),
    callbacks: {
      async redirect({ url, baseUrl }) {
        console.log(url, baseUrl);
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
    },
  })
);

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000");
});
