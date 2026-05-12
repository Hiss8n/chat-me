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

// map of userId -> socketId
const userSocketMap = new Map();
const getOnlineUser= (userId) => {
  // return the user id mapped to the socket id if exists, else return null

  return userSocketMap.get(userId) || null;
}

io.on("connection", (socket) => {
  const userId = socket.userId;
  // save/update the connected socket id for this user
  if (userId) userSocketMap.set(userId, socket.id)  ;
 
  // notify all clients about current online users
  io.emit("onlineUsers", Array.from(userSocketMap.keys()));
/* 
    io.on("new-message",(data)=>{
    console.log("msg",data)

   })  */

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user?.name, userId);
    if (userId) userSocketMap.delete(userId);
    io.emit("onlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server, getOnlineUser };
