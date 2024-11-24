import express from "express";
import {
  register,
  login,
  logout,
  refresh,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.delete("/logout", logout);

export default router;