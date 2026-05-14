
import { useEffect, useRef, useState } from 'react';
import timeAgo from '../api/utils/Date';
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import Messages from './messages';
import NoChatSelected from './NoSelectedUser';

function ChatSection() {

    const { selectedUser, sendMessage, messages, getMessagesWith, } = useChatStore();
    const [text, setText] = useState("");
    const { authUser,socketMessages } = useAuthStore();

    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        })

        console.log(bottomRef.current)
    }, [messages])

    /*    useEffect(() => {
           getMessagesWith(selectedUser?._id);
       }, [selectedUser])
   
       if (!authUser || !selectedUser) return null;
   
       const handleSendMessage = (e) => {
           e.preventDefault();
           if (!text.trim() || text === "") return;
   
           sendMessage(text.trim());
   
           setText("");
       } */

    return (
        <div className="flex-1 flex flex-col relative">
            <div ref={bottomRef} />

            {/* Chat Header */}
            {
                selectedUser ? (<div className="p-4 border-b flex items-center justify-between fixed top-0 left-90  w-[55%] mb-60" key={selectedUser?._id}>
                    <h2 className="font-semibold text-gray-700">{selectedUser?.name}</h2>

                    <span className="text-sm text-gray-500">{timeAgo(selectedUser.createdAt)}</span>
                </div>) : (<NoChatSelected />)
            }
            {/* Messages */}




            <Messages />





            {/*   {
                <div className='top-2 mt-14 flex-1 flex flex-col relative'>
                    {
                        messages.map((msg, index) => {
                            const isMe = msg.senderId[0] === authUser?._id;

                            return (
                                <>

                                    {isMe ? (
                                        <div className="chat chat-end"  >
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full">
                                                    <img
                                                        alt="Tailwind CSS chat bubble component"
                                                        src={`https://i.pravatar.cc/50?img=${authUser?._id}` || "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"}
                                                    />
                                                </div>
                                            </div>
                                            <div className="chat-header">
                                                {authUser?.name}
                                                <time className="text-xs opacity-50">{timeAgo(msg?.createdAt)}</time>
                                            </div>
                                            <div className="chat-bubble  bg-pink-500" key={index}>{msg.message}</div>
                                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                                        </div>
                                    ) : (
                                        <div className="chat chat-start">
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full">
                                                    <img
                                                        alt="Tailwind CSS chat bubble component"
                                                        src={`https://i.pravatar.cc/50?img=${selectedUser?._id}` || "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"}
                                                    />
                                                </div>
                                            </div>
                                            <div className="chat-header">
                                                {selectedUser?.name}
                                                <time className="text-xs opacity-50">{timeAgo(msg.createdAt)}</time>
                                            </div>
                                            <div className="chat-bubble bg-gray-400" key={index}>{msg.message}</div>

                                            <div className="chat-footer opacity-50">Delivered</div>

                                        </div>

                                    )}


                                </>
                            )
                        })
                    }
                    <div className="p-4  flex -bottom-48 flex-1 left-0  w-full mb-60 items-between absolute  ">
                        <input
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage(e)
                                }
                            }}

                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button onClick={(e) => handleSendMessage(e)} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                            send
                        </button>
                    </div>
                </div>} */}
            {/* Message Input */}

        </div>

    )
}

export default ChatSection