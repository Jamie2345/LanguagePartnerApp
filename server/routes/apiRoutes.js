import express from "express";
import {
  fetchUser,
  onboarding,
  search,
  createConversation,
  message,
  getConversation,
  getConversations,
  getUsers,
} from "../controllers/apiController.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user", authenticateToken, fetchUser);
router.put("/onboarding", authenticateToken, onboarding);
router.get("/search", authenticateToken, search);
router.post("/conversation", authenticateToken, createConversation);
router.put("/message", authenticateToken, message);
router.get("/conversation", authenticateToken, getConversation);
router.get("/conversations", authenticateToken, getConversations);
router.post("/users", authenticateToken, getUsers);

router.put("/profile", authenticateToken, onboarding); // update profile using the onboarding function as they both do the same thing.

export default router;