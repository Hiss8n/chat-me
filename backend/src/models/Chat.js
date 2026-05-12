import mongoose, { Schema } from "mongoose";

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
