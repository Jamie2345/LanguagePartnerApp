import express from "express";

import { ExpressAuth } from "@auth/express";
//import { CredentialsSignin } from "@auth/express";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db.js";
import Credentials from "@auth/express/providers/credentials";
const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello World! from api" });
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});

app.set("trust proxy", true);
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
          //const response = await fetch(request);
          //if (!response.ok) return null;
          //return (await response.json()) ?? null;
          console.log(credentials);
          return credentials;
        },
      }),
    ],
    adapter: MongoDBAdapter(client),
  })
);
