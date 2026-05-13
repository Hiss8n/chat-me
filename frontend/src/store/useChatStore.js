import { create } from "zustand";
import axiosInstance, { API_URL } from "../api/api";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  contacts: [],
  messages: [],
  isLoading: false,
  selectedUser: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isLoading: true });
    try {
      const token=useAuthStore.getState().token;


      const res = await fetch(`${API_URL}/user`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${token}`
          
        }
      });

      const data=await res.json()

      set({ contacts: data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getMessagesWith: async (participantId) => {
    // guard: no participantId -> clear messages and skip request
    if (!participantId) {
      set({ messages: [] });
      return;
    }

    const token = useAuthStore.getState().token;
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/messages/${participantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      set({ messages: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const token = useAuthStore.getState().token;
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `${Date.now()}`;
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/messages/send/${selectedUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messageData,
        }),
      });

      const data = await res.json();
      /*   console.log("messageData", data); */
      set({ messages: [...messages, data] });
    } catch (error) {
      console.log(error);
      set({ messages: messages });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile:async(updatedData)=>{
    const token = useAuthStore.getState().token;
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      console.log("update response", data);

      if (response.ok) {
        // Update successful, update the selectedUser in the store
        set({ selectedUser: data });
      } else {
        console.log("Failed to update profile:", data.message);
      }
      return;
    } catch (error) {
      console.log(error);   
     } finally {
      set({ isLoading: false });
      
    }
  }
}));
