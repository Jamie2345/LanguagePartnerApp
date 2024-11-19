const express = require("express");
import { ExpressAuth } from "@auth/express";
//import { CredentialsSignin } from "@auth/express";
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
  "/auth/*",
  ExpressAuth({
    providers: [
      Credentials({
        credentials: {
          username: { label: "Username" },
          password: { label: "Password", type: "password" },
        },
        async authorize({ request }) {
          const response = await fetch(request);
          if (!response.ok) return null;
          return (await response.json()) ?? null;
        },
      }),
    ],
  })
);
