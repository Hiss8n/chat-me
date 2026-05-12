import express from "express";
import cors from "cors";
import axios from "axios";

import { app, server } from "./src/utils/socket.js";
import userRoutes from "./src/routes/user.route.js";
import messagesRoutes from "./src/routes/message.routes.js";
import getChatsRoutes from "./src/routes/chat.routes.js";
import connectDB from "./src/utils/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders:["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use("/api/user", userRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/chats", getChatsRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

// Health check route

const consumerKey = "dNqhI7DCiajm1cNqiQkT7zpP7ZbCq3ibpyQyIJKyE9yOGYIx";
const consumerSecret =
  "7IApu3zEpRpwFKvsxxVmmBPmZEUesa9ydxHEkDFAMgdQmTqAbkGTloFlXrUcra7x";

const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

const getAccessToken = async (_, res) => {
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      },
    );

    return res.status(200).json(response.data.access_token);
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message,
    );
  }
};

// Simple test route

app.get("/stk-puskpushtest", getAccessToken, async (_, res) => {
  try {
    const token = await getAccessToken();
    if (!token)
      return res
        .status(400)
        .json({ success: true, message: "No access security token found" });

    res.status(200).json({ success: true, access_token: token });
  } catch (error) {
    console.log("Unable to test the stp pusf now", errorMonitor);
  }
});

app.post("/skt-test", async () => {
  const token = await getAccessToken();

  const URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  try {
    const res = await axios.post(`${URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {}
});

server.listen(PORT, () => {
  (connectDB(),
    console.log(` Server running on port http://localhost:${PORT}`));
});
