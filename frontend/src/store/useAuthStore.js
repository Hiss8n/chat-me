
import { create } from "zustand";
import { io } from "socket.io-client";
import axiosInstance, { API_URL } from "../api/api";

const BASE_URL = import.meta.env.DEV ? "http://localhost:5000" : API_URL;

export const useAuthStore = create((set, get) => ({

  authUser: null,
  token: null,
  isLoading: false,
  isCheckingAuth: false,
  socket: null,
  onlineUsers: [],
  socketMessages:[],

  checkAuth: () => {
    set({ isCheckingAuth: true });
    try {
      const user = localStorage.getItem("authUser");
      const myToken = localStorage.getItem("token");

      if (myToken) {
        set({ authUser: JSON.parse(user), token: myToken });
      }
      set({ isCheckingAuth: false });
      get().connectSocket();

      return;
    } catch (error) {
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
    
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();
      // persist and set state before connecting socket
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      set({ authUser: data.user, token: data.token });
      // connect after token is set
      get().connectSocket();

      return data;
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

        const data = await res.json();
        // persist and set state before connecting socket
        localStorage.setItem("authUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        set({ authUser: data.user, token: data.token });
        console.log("A user connected now!");
        // connect after token is set
        get().connectSocket();

      return data;
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ isLoading: true });
    try {
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");

      set({ token: null, authUser: null });
      // ensure socket is disconnected
      get().disConnectSocket();
      return;
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
   sendMessageSocket: (message) => {
    const { socket } = get();

    if (!socket) return;

    // emit to server
    socket.emit("send-message", message);

    socket.on("new-message", (data) => {
      set({socketMessages:[...get().socketMessages,data]  })

     
  }) }, 
   
    // optional: optimistic update (show instantly)
   


  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(API_URL, {
      withCredentials: true,
      auth: { token: get().token },
    });

    socket.connect();

    set({ socket });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("socket connect_error", err?.message || err);
    });
    //send message
     socket.on("new-message", (message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("onlineUsers", (userIds) => {
      console.log("received onlineUsers", userIds);
      set({ onlineUsers: [...userIds,userIds] });
    });
  },

  disConnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },


  }));
