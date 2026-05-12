import User from "../models/User.js";
import jwt from "jsonwebtoken";

const socketAuthMiddleware = async (socket, next) => {
  try {
    // Accept token from socket.handshake.auth.token (client-side) or fallback to cookie
    const token =
      socket.handshake?.auth?.token ||
      socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

    if (!token) {
      return next(new Error("Unauthorised-No token provided!!"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return next(new Error("Invalid token"));
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return next(new Error("Invalid token user not found"));
    }

    socket.user = user;
    
    socket.userId = user._id.toString();
   
    next();
  } catch (error) {
    console.log("Socket auth error", error);
    return next(new Error("Socket authentication failed"));
  }
};

export default socketAuthMiddleware;
