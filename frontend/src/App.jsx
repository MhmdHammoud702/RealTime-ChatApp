import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import Navbar from "./Components/Navbar.jsx"
import {useAuthStore} from "./store/useAuthStore.js"
import {Loader} from "lucide-react"
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();
  console.log({onlineUsers});
  useEffect(()=>{
    checkAuth()  
  },[checkAuth]); 
  
  console.log({authUser});
  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen' data-theme={theme}>
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  return (
    <div data-theme={theme}>
       <Toaster/>
      <Navbar/>
    <Routes>
      <Route path='/' element={authUser? <HomePage/> : <Navigate to="/signin"/>}/>
      <Route path='/signup' element={!authUser? <SignUpPage/> : <Navigate to="/"/>}/>
      <Route path='/signin' element={!authUser? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path='/settings' element={<SettingsPage/>}/>
      <Route path='/profile' element={authUser? <ProfilePage/> : <Navigate to="/signin"/>}/>
    </Routes>
    </div>
  )
}

export default App