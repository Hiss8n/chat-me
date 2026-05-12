import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(404).json({ message: "No token" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId).select("-password");
    if (!user) return res.status(400).json({ message: "invalid token" });

    req.user = user._id.toString();
    next();
  } catch (error) {
    console.log("sever error", error);
  }
};

export default protectedRoute;
