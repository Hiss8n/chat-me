import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'




function Contacts() {


    const { getAllContacts, contacts, getMessagesWith, selectedUser, setSelectedUser } = useChatStore()
    const { onlineUsers } = useAuthStore();


    /*  if (!selectedUser) return null */
    /*   useEffect(() => {
          !selectedUser && !selectedUser._id
          return
      }, [selectedUser, login])
   */
    useEffect(() => {
        getAllContacts()
        

    }, [])
console.log("this are online users", onlineUsers)




    const handleSellectedUser = (contact) => {
        setSelectedUser(contact)
        getMessagesWith(contact._id)
        console.log(contact._id)

    }



    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* User Item */}

            {
                contacts.length > 0 ? (
                    contacts.map((contact, index) => (<div onClick={() => handleSellectedUser(contact)} className={`flex-col gap-5 ${selectedUser?._id === contact._id ? "bg-slate-400" : ""}`} key={contact?._id} >
                        <div className='flex flex-col space-y-3' key={contact._id}>
                            <div className={`flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition `}>
                                <img
                                    src={contact?.profilePic || `https://i.pravatar.cc/150?img=${index}`}
                                    alt="User"
                                    className="w-8 rounded-full"
                                />
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {contact?.name}
                                    </h3>

                                    <div className={`w-2 h-2 rounded-full ${onlineUsers?.includes(contact._id) ? "bg-green-500" : ""}`}/>
                                </div>
                            </div>

                        </div></div>))
                ) : (
                    <div>
                        <p>No contact yet</p>
                    </div>)
            }

        </div>
    )
}

export default Contacts