import express, { request } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { authenticateToken } from "./middleware/auth.middleware.js";

import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import Conversation from "./models/Conversation.js";

import interestOptions from "./dataOptions/interests.js";
import LanguageOptions from "./dataOptions/countries.js";
import ProficiencyOptions from "./dataOptions/proficiencies.js";

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

    function objectsAreEqual(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    function isLanguagesValid(languages) {
      for (let i = 0; i < languages.length; i++) {
        const language = languages[i].language;
        const proficiency = languages[i].proficiency;

        const languageExists = LanguageOptions.some((option) =>
          objectsAreEqual(option, language)
        );

        const proficiencyExists = ProficiencyOptions.some((option) =>
          objectsAreEqual(option, proficiency)
        );

        console.log(language);
        console.log("LanguageOptions", LanguageOptions);
        console.log("ProficiencyOptions", ProficiencyOptions);

        if (!languageExists || !proficiencyExists) {
          console.log("Invalid language or proficiency");
          return false;
        }
      }
      return true;
    }

    function isInterestsValid(interests) {
      for (let i = 0; i < interests.length; i++) {
        const interest = interests[i];

        const interestExists = interestOptions.some((option) =>
          objectsAreEqual(option, interest)
        );

        if (!interestExists) {
          console.log("Invalid interest:", interest);
          return false;
        }
      }

      return true;
    }

    if (data?.nationality && data?.languages) {
      // validate langauges
      if (data.languages.length < 2 || data.languages.length > 10) {
        return res.status(400).json({
          message:
            "Please select between 2 and 10 languages (one should be your native languages and the others should be languages you are learning).",
        });
      }

      function removeDuplicates(array) {
        const uniqueArray = Array.from(
          new Set(array.map((item) => JSON.stringify(item)))
        );
        return uniqueArray.map((item) => JSON.parse(item));
      }

      const languages = removeDuplicates(data.languages);
      console.log(languages);

      if (!isLanguagesValid(languages))
        return res
          .status(400)
          .json({ message: "Invalid language or proficiency" });

      // validate interests
      if (data?.interests) {
        if (data.interests.length > 10)
          return res
            .status(400)
            .json({ message: "Please select a maximum of 10 interests." });
        if (!isInterestsValid(data.interests))
          return res.status(400).json({ message: "Invalid interests" });
      }

      // validate nationality
      if (data.nationality.length !== 2) {
        return res.status(400).json({
          message: "Please provide a valid 2 letter nationality code",
        });
      }

      const dataToUpdate = {
        nationality: data.nationality,
        languages: languages,
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

    query["username"] = { $ne: req.user.username }; // dont include the user in their own search for others.

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

function isValidRequestor(requestingUser) {  // function to make sure the req.user has onboarded first
  return (
    requestingUser?.languages &&
    requestingUser?.languages.length > 1 && 
    requestingUser?.nationality
  );
}

app.post("/api/conversation", authenticateToken, async (req, res) => {
  try {
    if (!isValidRequestor(req.user)) {
      return res.status(400).json({
        message: "Please complete your profile before starting a conversation",
      });
    }

    const { recipientId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ message: "Please provide recipientId" });
    }

    // check this user is valid before starting a conversation.
    const foundRecipient = await User.findById(recipientId);
    if (!foundRecipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // make sure they are messaging a valid account
    if (!isValidRequestor(foundRecipient)) {
      return res.status(400).json({
        message: "Recipient has not completed their profile yet",
      });
    }

    if (req.user._id.toString() === recipientId) {
      return res.status(400).json({
        message: "You cannot start a conversation with yourself",
      });
    }

    const existingConversation = await Conversation.findOne({
      users: { $all: [req.user._id, recipientId] },
    });
    if (existingConversation) {
      return res.status(400).json({ message: "Conversation already exists" });
    }

    // if code gets to here then everything is valid
    const conversation = new Conversation({
      users: [req.user._id, recipientId],
    });
    
    const savedConversation = await conversation.save();
    if (!savedConversation) {
      return res.status(500).json({ message: "An unexpected error occured" });
    }
    return res.status(200).json(savedConversation);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/api/message", authenticateToken, async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!conversationId || !message) {
      return res.status(400).json({ message: "Please provide conversationId and message" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.users.includes(req.user._id)) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const newMessage = {
      from: req.user._id,
      to: conversation.users.find((id) => id.toString() !== req.user._id.toString()),  // finds the other user who isn't the req.user
      content: message,
    };

    conversation.messages.push(newMessage);
    const savedConversation = await conversation.save();
    if (!savedConversation) {
      return res.status(500).json({ message: "An unexpected error occured" });
    }
    return res.status(200).json(savedConversation);


  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/conversation", authenticateToken, async (req, res) => {
  try {
    const {conversationId} = req.query;
    if (!conversationId) {
      return res.status(400).json({ message: "Please provide conversationId" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.users.includes(req.user._id)) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    return res.status(200).json(conversation);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/conversations", authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ users: req.user._id });
    return res.status(200).json(conversations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000");
});
