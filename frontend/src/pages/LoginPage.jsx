import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Eye, EyeClosed, EyeOffIcon, Loader, LockIcon, Mail, MessageSquare, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../Components/AuthImagePattern';
import toast  from 'react-hot-toast';
const LoginPage = () => {
  const [showPassword,setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    email: "",
    password: "",
  });

  const {Login,isLoggingIn} = useAuthStore();
  const navigate= useNavigate();
  const validateForm = ()=>{
    if(!formData.email.trim()) return toast.error("email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if(!formData.password.trim()) return toast.error("Password is required")
    if(formData.password.length< 6 ) return toast.error("Password must be at least 6 characters")
    return true;
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = validateForm();
  if (success === true) {
    const loggedIn = await Login(formData);
    if (loggedIn) {
      navigate("/"); 
    }
  }
};
  return (
    
    <div className='h-[calc(100vh-4.1rem)] grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
         <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
         <div className='text-center mb-8'>
          <div className='flex flex-col items-center gap-2 group'>
          <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center
          group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className='size-6 text-primary'/>
          </div>
          <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
          <p className='text-base-content/60'>Sign in to your account</p>
          </div>
          </div>
          {/*form*/}
          <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='form-control space-y-6'>
            <div>
            <label className='label'>
              <span className='label-text font-medium'>Email</span>
            </label>
            <div className='relative'>
            <div className='absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none' > 
                <Mail className='size-5 text-base-content/40'/>
            </div>
            <input 
              type='text'
              className='input input-bordered w-full pl-12 focus:outline-0.5 focus:outline-base-content/30 focus:ring-1 focus:ring-base-content/40 focus:border-base-content/40'
              placeholder='you@example.com'
              value={formData.email}
              onChange={(e)=>setFormData({...formData,email:e.target.value})}
              />
            </div>  
            </div>

             <div>
            <label className='label'>
              <span className='label-text font-medium'>Password</span>
            </label>
            <div className='relative'>
            <div className='absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none' > 
                <LockIcon className='size-5 text-base-content/40'/>
            </div>
            <input 
              type={showPassword? "text" : "password"}
              className='input input-bordered w-full pl-12 focus:outline-0.5 focus:outline-base-content/30 focus:ring-1 focus:ring-base-content/40 focus:border-base-content/40'
              placeholder='password'
              value={formData.password}
              onChange={(e)=>setFormData({...formData,password:e.target.value})}
              />
             <button type='button' className='absolute inset-y-0 z-100 right-0 pr-3 flex items-center' onClick={()=>setShowPassword(!showPassword)} >{showPassword? (<EyeOffIcon className='size-5 text-base-content/40 cursor-pointer'/>) : (<Eye className='size-5 text-base-content/40 cursor-pointer '/>)}</button>     
            </div>  
            </div>
          </div>
            <button type="submit" className='btn btn-primary w-full'>
              {isLoggingIn? (<><Loader className='size-5 animate-spin'/>Loading...</>): "Sign in"}
            </button>
          </form>
          
      </div>
       <div className='text-center text-sm mt-2'>
            <p className='text-base-content/60'>Don't have an account?{" "}
             <Link to={"/signup"} className="link link-primary">Create account</Link>
            </p>
       </div>
     </div>

     {/* right side */}
     <AuthImagePattern
      title="Welcome back!"
      subtitle="Sign in to continue your conversations and catch up with your messages"/>
    </div>
  )
}

export default LoginPage