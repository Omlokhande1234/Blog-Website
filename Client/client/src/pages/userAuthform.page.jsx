import React, { useRef } from 'react'
import Inputbox from '../components/input.component'
import { FaGoogle } from 'react-icons/fa'
import {Link} from 'react-router-dom'
import AnimationWrapper from '../Common/page-animation'
import {Toaster,toast} from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from '../Common/session'
export default function UserAuthform({type}) {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
  

  const userAuthThroughServer=(serverRoute,formData)=>{
    axios.post(`/api/auth/${serverRoute}`,formData)
    .then(({data})=>{
      storeInSession("user",JSON.stringify(data))
      console.log(sessionStorage)
    })
    .catch(({response})=>{
      toast.error(response.data.error)

    })
  }
  const handlesubmit=async(e)=>{ 
    e.preventDefault()
    let serverRoute=type=="sign-in"?"/signin":"/signup"
    let form=new FormData(formElement)
    let formData={}
    for(let [key,value] of form.entries()){
      formData[key]=value
    }
    console.log(formData)
    let {fullname,email,password}=formData

    if(fullname){
      if(fullname.length<3){
        return toast.error("Full name must be atleast 3  characters long")
      }
    }
    if(!email.length){
      return toast.error("Enter the email")
    }
    if(!emailRegex.test(email)){
      return toast.error("Enter the valid email")
    }
    if(!passwordRegex.test(password)){
      return toast.error("Password must be atleast 8 to 10 letters it must contains one uppercase letter")
    }
    userAuthThroughServer(serverRoute,formData)

  }

  return (
    <AnimationWrapper keyValue={type}>
        <section className='h-cover flex items-center justify-center'>
            <Toaster/>
            <form id='formElement'  className='w-[80%] max-w-[400px]'>
                <h1 className='text-center text-4xl font-gelasio capitalize mb-24  '>
                    {type=="sign-in"? "Welcome back":"Create an account"}
                </h1>
                {
                type!== 'sign-in' ?
                <Inputbox
                type="text" 
                placeholder="Enter your name" 
                name='fullname' 
                />
                : ""
                }
              <Inputbox
                type="mail" 
                placeholder="Enter your mail" 
                name='email' 
              />
              <Inputbox
                type="password" 
                placeholder="Enter password" 
                name='password' 
              />
              <button onClick={handlesubmit} type='submit' className='flex items-center whitespace-nowrap bg-black text-white rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-90  block mx-auto mt-14'>
                {type.replace("-"," ")}

              </button>
              <div className="flex items-center my-8 relative w-full gap-2 uppercase text-black font-bold opacity-60">
                <hr className='w-1/2' />
                or
                <hr className='w-1/2' />
              </div>
              <button 
              type='button' 
              className='whitespace-nowrap bg-black text-white rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-90  block mx-auto mt-8 flex justify-center items-center gap-2'>
                <FaGoogle />
                continue with google
              </button>
              {
                type=='sign-in' 
                ? <p className='text-xl text-center mt-3 text-gray'>
                      Don't have an account ?
                     <Link to='/signup' className='underline mx-1 text-xl text-black'>
                          Sign Up
                     </Link>
                  
                  </p> 
                :<p className='text-xl text-center mt-3 text-dark-grey' >
                  Already have an account ?
                  <Link to='/signin' className='underline mx-1 text-xl text-black'>
                    Sign In
                  </Link>
                  </p>
              }
            </form>

        </section>
      
    </AnimationWrapper>
  )
}
