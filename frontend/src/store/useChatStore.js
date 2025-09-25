import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";



export const useChatStore = create((set,get)=> ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,


    getUsers: async()=>{
        set({isUserLoading:true});
        try {
          const res = await axiosInstance.get("/messages/users");
          set({users: res.data});
        } catch (error) {   
          toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false})
        }
    },

    getMessages: async(userId)=>{
        set({isMessageLoading:true});
        try {
           const res = await axiosInstance.get(`/messages/${userId}`);
           set({messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
        set({isMessageLoading:false});
        }
    },


    sendMessage: async(Messagedata)=>{
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,Messagedata);
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message);      
        }
    },

    subscribeToMessages: () => {
  const { selectedUser } = get();
  const socket = useAuthStore.getState().socket;
  if (!selectedUser || !socket) return;

  socket.on("newMessage", (newMessage) => {
    set({ messages: [...get().messages, newMessage] });
  });
},

unsubscribeToMessages: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;
  socket.off("newMessage");
},

    //todo:optimize this later
    setSelectedUser: (selectedUser) => set({selectedUser})
}))