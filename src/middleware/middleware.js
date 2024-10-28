import { verifyToken } from "../service/jwt.service.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Failed to authenticate token" });
  }

  if (decoded.exp < Date.now().valueOf() / 1000) {
    return res.status(401).json({ message: "Token has expired" });
  }

  req.userId = decoded.id;
  next();
};

export default authenticate;
