import Credentials from "@auth/express/providers/credentials";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const authConfig = {
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
};
