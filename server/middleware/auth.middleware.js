import jwt from "jsonwebtoken";

export async function authenticateToken(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthed" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.status(403).json({ error: "forbidden" });
    req.user = data.user;
    next();
  });
}
