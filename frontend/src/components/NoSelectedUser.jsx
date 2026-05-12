



import { MessageCircle } from "lucide-react";

function NoChatSelected() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center px-6 bg-gray-50">

            {/* Icon */}
            <div className="bg-blue-100 p-4 rounded-full mb-4">
                <MessageCircle className="w-10 h-10 text-blue-500" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Chat Selected
            </h2>

            {/* Description */}
            <p className="text-gray-500 max-w-sm">
                Select a user from the sidebar to start a conversation and begin chatting.
            </p>

        </div>
    );
}

export default NoChatSelected;