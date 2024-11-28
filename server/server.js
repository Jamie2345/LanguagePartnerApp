import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { authenticateToken } from "./middleware/auth.middleware.js";

import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";

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
  const sanitisedObj = { ...data };
  delete sanitisedObj.password;
  return sanitisedObj;
};

app.get("/api/protected", authenticateToken, async (req, res) => {
  return res
    .status(200)
    .json({ message: "You are authenticated", user: req.user });
});

app.get("/api/user", authenticateToken, async (req, res) => {
  console.log("User is authenticated");
  console.log(req.user);
  const user = sanitiseResponse(req.user);
  return res.status(200).json({ user: user });
});

app.put("/api/onboarding", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;

    if (data?.nationality && data?.languages) {
      const dataToUpdate = {
        nationality: data.nationality,
        languages: data.languages,
      };
      if (data.interests) dataToUpdate.interests = data.interests;

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        dataToUpdate,
        { new: true } // This returns the updated one otherwise for some reason it returns old one
      );

      console.log(updatedUser);

      return res
        .status(200)
        .json({ message: "Successfully updated user", user: updatedUser });
    } else {
      return res
        .status(400)
        .json({ message: "Please provide nationality and languages fields." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An unexpected error occured." });
  }
});

app.get("/api/search", authenticateToken, async (req, res) => {
  try {
    const { language, proficiency, interests } = req.query;
    console.log(req?.user);
    console.log(language, proficiency, interests);
    const query = {};

    query['username'] = { $ne: req.user.username }; // dont include the user in their own search for others.

    if (language && proficiency) {
      query["languages"] = {
        $elemMatch: {
          // mongodb query to match both language and proficiency
          "language.value": language,
          "proficiency.value": proficiency,
        },
      };
    } else {
      // default to showing similar users.
      const userLanguages = req?.user?.languages;
      const languageValues = userLanguages.map((lang) => lang.language.value);

      console.log("defaulted to showing similar users");
      console.log("Searching for users with languages:", languageValues);

      query["languages"] = {
        $elemMatch: { "language.value": { $in: languageValues } },
      };
    }

    if (interests) {
      const interestsArray = Array.isArray(interests)
        ? interests
        : interests.split(",");
      query["interests"] = {
        $elemMatch: { value: { $in: interestsArray } },
      };
    }

    const users = await User.find(query).select("-password"); // dont include pass in response obviously

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000");
});
