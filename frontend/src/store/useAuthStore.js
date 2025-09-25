import axios from "axios"
import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const baseUrl = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLogginIn:false,
    isUpdatingProfile:false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    
    checkAuth: async() => {
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
            get().connectSocket();
        }catch(error){
            console.log("Error in checkAuth:",error)
            set({authUser: null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try {
          const res = await axiosInstance.post("/auth/signup",data);
          toast.success("Account created successfully");
          set({authUser: res.data})
          get().connectSocket();
          
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }finally{
        set({isSigningUp:false});
        }
    },

    Login: async (data) => {
    set({ isLogginIn: true });
    try {
    const res = await axiosInstance.post("/auth/login", data);
    set({ authUser: res.data });
    toast.success("Successfully Logged in");
    get().connectSocket();
    return true;
    } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
    return false;
   } finally {
    set({ isLogginIn: false });
   }
   },

    Logout: async()=>{
        try {
            axiosInstance.post("/auth/logout");
            set({authUser: null})
            const socket = get().socket;
            if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
            }
        } catch (error) {
            console.log("cant logout",error)
        }
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile: true});
        try{
          const res = await axiosInstance.put("/auth/update-profile",data);
          set({authUser: res.data });
        }catch(error){
          console.log("error in update profile:",error);
        }finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(baseUrl,{
            query:{
            userId: authUser._id,
            }
        })
        socket.connect();
        set({socket: socket});
        socket.on("getOnlineUsers",(userIds)=>{set({onlineUsers : userIds})})
    },
    diconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnected()
    }
}));