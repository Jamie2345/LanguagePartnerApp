import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshTokenDB from "../models/RefreshToken.js";
import saltHashPassword from "../utils/hashPassword.js";

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
  try {
    const credentials = req.body;
    if (credentials && credentials?.username && credentials?.password) {
      console.log(credentials);
      const user = await User.findOne({ username: credentials.username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // compare the hashes
      const isMatch = await bcrypt.compare(credentials.password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // if code reaches here then user has correct details
      console.log(user);
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 600, // 10 minutes
      }); // setting expires in time for security.
      const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60,
      });

      // add refresh token to database.
      const refreshTokenDB = new RefreshTokenDB({
        refreshToken: refreshToken,
      });
      const savedRefreshToken = await refreshTokenDB.save();
      console.log(savedRefreshToken);

      return res.status(200).json({ accessToken });
    }
    return res.status(400).json({ error: "Bad request" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unexpected internal server error" });
  }
};

export const refresh = async (req, res) => {
  console.log(req.cookies);
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const foundRefreshToken = await RefreshTokenDB.findOne({refreshToken: refreshToken});

  if (!foundRefreshToken) return res.status(401).json({ error: "Unauthorized" });

  // if the refresh token is in the db generate new access token.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) return res.status(403).json({ error: "forbidden" });

    const user = data.user;
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 600, // 10 minutes
    }); // setting expires in time for security.
    return res.status(200).json({ accessToken });
  });
};

export const logout = async (req, res) => {
  console.log(req.cookies);
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const foundRefreshToken = await RefreshTokenDB.findOneAndDelete({refreshToken: refreshToken});

  if (!foundRefreshToken) return res.status(401).json({ error: "Unauthorized" });

  return res.status(200).json({ message: "Successfully logged out" });
};