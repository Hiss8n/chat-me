import { useEffect, useRef, useState } from "react";
import ChatSection from "./chat";
import Contacts from "./contacts";
import SearchUser from "./searchUsers";
import { useAuthStore } from "../store/useAuthStore";
import { Camera } from "lucide-react";
import { useChatStore } from "../store/useChatStore";



const ChatUi = () => {

    const { authUser, checkAuth, isCheckingAuth, logout, onlineUsers, socket } = useAuthStore()
    const { updateUserProfile } = useChatStore()
        const [base64Image, setBase64Image] = useState("");

        console.log("64",
            base64Image
        )

    const imageRef = useRef(null);

        const handleImageUpload = async (e) => {
            // If invoked from the camera button (click), open file dialog
            if (e?.type === "click") {
                imageRef.current?.click();
                return;
            }

            // If invoked from the file input change event, read file and upload
            const file = e?.target?.files?.[0] || imageRef.current?.files?.[0];
            if (!file) return;

            const reader = new FileReader();
         
            reader.onload = async (ev) => {

                const base64 = ev.target.result; // data:<mime>;base64,....
                try {
                     const res= await updateUserProfile(base64)
                        console.log("response from image", res);

                        setBase64Image(base64);
                    
                } catch (error) {
                    console.error("Error uploading image:", error);
                    
                }


              

                
             console.log("base64 here:!!!", base64);

              
            };
            reader.readAsDataURL(file);

        };



    useEffect(() => {
        checkAuth(),

            console.log(onlineUsers)

    }, [])


    const handleLogout = () => {
        console.log("logout")
        logout()
    }   

    if (isCheckingAuth) {
        return null
    }




    return (
        <div className="h-screen flex bg-gray-100 ">

            {/* LEFT SIDEBAR - USER PROFILE */}

            {/* RIGHT SIDEBAR - SEARCH USERS */}
            <div className="w-1/4 bg-white border-l flex flex-col overflow-hidden ">
                <SearchUser />

                <Contacts />


            </div>


            {/* CENTER - CHAT SECTION */}
            <ChatSection />
            <div className="w-1/5 bg-white border-r flex flex-col overflow-hidden  ">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-4 absolute top-0 ">
                        <img
                            src={base64Image || "https://i.pravatar.cc/150?img=4"}
                            alt="User"
                            className="w-12 h-12 rounded-full"
                        />
                        <input type="file" id="imageUpload" accept="image/*" className="hidden" ref={imageRef} onChange={handleImageUpload} />  
                        <button className="p-2 rounded-full bg-white relative
                         hover:bg-gray-200 transition -left-16 top-5" onClick={(e) => handleImageUpload(e)}>
        
                          <Camera size={8}  />
                         </button>
                        
                        <div>
                            <h2 className="font-semibold text-gray-800">{authUser?.name}</h2>
                            <p className="text-sm text-green-500">online</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <p className="text-gray-500 text-sm">{authUser?.name}</p>
                    <div className="mt-4 text-sm text-gray-600">
                        <p>{authUser?.email}</p>
                        <p>Status: Available</p>
                        <button className="px-10 p-2 rounded-md bg-red-700 border-none text-white font-2xl" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>



        </div>
    );
}


export default ChatUi