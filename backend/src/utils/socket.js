import { Server } from "socket.io";
import http from "http";
import express from "express";
import socketAuthMiddleware from "./socketAuthMiddleware.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

// support multiple sockets per user (multiple tabs/devices)
// userId -> Set(socketId)
const userSockets = new Map();
// socketId -> userId
const socketToUser = new Map();
// socketId -> user info (from DB, no password)
const socketInfo = new Map();

const getOnlineUser = (userId) => {
  const set = userSockets.get(userId);
  return set ? Array.from(set) : null;
}

// (removed getAllOnlineSocketIds) — use Array.from(socketInfo.keys()) where needed

io.on("connection", (socket) => {
  const userId = socket.userId;
  // track socket -> user and user -> sockets
  if (userId) {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);
    socketToUser.set(socket.id, userId);
    // store user info for this socket (socketAuthMiddleware already set socket.user)
    if (socket.user) socketInfo.set(socket.id, socket.user);
  }

  // notify all clients about current online users (user ids) and socket ids
  io.emit("onlineUsers", Array.from(userSockets.keys()));
  io.emit("onlineSocketIds", Array.from(socketInfo.keys()));
/* 
    io.on("new-message",(data)=>{
    console.log("msg",data)

   })  */

  socket.on("disconnect", () => {
    const sid = socket.id;
    const uid = socketToUser.get(sid);
    console.log("A user disconnected", socket.user?.name, uid, sid);
    socketToUser.delete(sid);
    socketInfo.delete(sid);
    if (uid && userSockets.has(uid)) {
      const set = userSockets.get(uid);
      set.delete(sid);
      if (set.size === 0) userSockets.delete(uid);
    }

    io.emit("onlineUsers", Array.from(userSockets.keys()));
    io.emit("onlineSocketIds", Array.from(socketInfo.keys()));
  });
});

const getSocketUserMap = () => {
  // return plain object: { socketId: { _id, name, email, profilePic } }
  const out = {};
  for (const [sid, user] of socketInfo.entries()) {
    out[sid] = {
      userId: user._id?.toString(),
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    };
  }
  return out;
}

export { io, app, server, getOnlineUser, getAllOnlineSocketIds, getSocketUserMap };
