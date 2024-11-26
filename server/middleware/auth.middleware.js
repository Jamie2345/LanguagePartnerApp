import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticateToken(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthed" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
    if (err) return res.status(403).json({ error: "forbidden" });
    try {
      const userId = data.user._id;
      const foundUser = await User.findById(userId);

      if (!foundUser) return res.status(404).json({ error: "user not found" });

      const userObj = foundUser.toObject();
      req.user = userObj;
      next();
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "unexpected internal server error" });
    }
  });
}
