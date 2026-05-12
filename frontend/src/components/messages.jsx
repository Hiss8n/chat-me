import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import timeAgo from '../api/utils/Date';
import { SendHorizontal } from 'lucide-react';

function Messages() {


    const { selectedUser, sendMessage, messages, getMessagesWith } = useChatStore();
    const [text, setText] = useState("");
    const { authUser,sendMessageSocket ,socketMessages} = useAuthStore();
    

    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        })

        console.log(bottomRef.current)
    }, [messages])

    useEffect(() => {
        if (selectedUser?._id) getMessagesWith(selectedUser._id);

        if(text){
            sendMessageSocket(text);
        }
    }, [selectedUser])

    if (!authUser || !selectedUser) return null;

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || text === "") return;
        sendMessageSocket(text.trim());


        sendMessage(text.trim());
        

        setText("");
    }

    console.log("msgs",socketMessages);




    return (
        <div className=''>
            {
                <div className='top-2 mt-14  h-[82vh] overflow-y-auto  bottom-40 pb-10'>
                    {
                        messages.map((msg, index) => {
                            const isMe = msg.senderId[0] === authUser?._id;

                            return (
                                <>

                                    {isMe ? (
                                        <div className="chat chat-end "  >
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full">
                                                    <img
                                                        alt="Tailwind CSS chat bubble component"
                                                        src={`https://i.pravatar.cc/50?img=${index}` || "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"}
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
                                        <div className="chat chat-start ">
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full">
                                                    <img
                                                        alt="Tailwind CSS chat bubble component"
                                                        src={`https://i.pravatar.cc/50?img=${index}` || "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"}
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
                    <div className="p-4  flex -bottom-48 flex-1 left-0  w-full mb-60 items-between absolute ">
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
                            className=" border-none rounded-sm px-12 py-2 focus:outline-none focus:ring-1 focus:ring-slate-200 w-[990px] relative"
                        />
                        <button onClick={(e) => handleSendMessage(e)} className="bg-transparent  px-2 py-1 rounded-sm hover:bg-slate-100 transition absolute right-0 top-0 bottom-5 flex items-center mt-4 mr-6 ">
                            <SendHorizontal size={24} color='gray' />
                        </button>
                    </div>
                    <div ref={bottomRef} />
                </div>}

            {/* Message Input */}
        </div>
    )
}

export default Messages