import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { getSocketUserMap, io } from "../utils/socket.js";


const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user;
  const { message } = req.body;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [receiverId, senderId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [receiverId, senderId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // If the receiver is online, send the message in real-time before saving
    const socketUserMap = getSocketUserMap();
    const receiverSocketIds = Object.entries(socketUserMap)
      .filter(([, user]) => user.userId === receiverId)
      .map(([sid]) => sid);

    if (receiverSocketIds.length > 0) {
      const payload = {
        sender: { _id: senderId },
        receiverId,
        message,
        // note: not yet saved so no _id/timestamps
        pending: true,
        sentAt: new Date().toISOString(),
      };
      receiverSocketIds.forEach((sid) => io.to(sid).emit("new-message", payload));
    }
    console.log("payload",payload)

    // save message so it has _id and timestamps
    const savedMessage = await newMessage.save();

    if (savedMessage) {
      chat.messages.push(savedMessage._id);
      await chat.save();
    }

    // emit the final saved message (with _id) if receiver still online
    if (receiverSocketIds.length > 0) {
      receiverSocketIds.forEach((sid) =>
        io.to(sid).emit("new-message-saved", {
          ...savedMessage._doc,
          sender: { _id: senderId },
        }),
      );
    }

    return res.status(201).json(savedMessage);
  } catch (error) {
    console.error("error creating message", error);
    return res.status(500).json({ message: "Error creating message" });
  }
};

const getMessages = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user;

  try {
    // validate required ids
    if (!senderId || !receiverId) {
      return res.status(200).json([]);
    }

    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!chat) return res.status(200).json([]);

    res.status(200).json(chat.messages || []);
  } catch (error) {
    console.log("error getting messages for", error);
    return res.status(500).json({ message: "Error fetching messages" });
  }
};

export { sendMessage, getMessages };
