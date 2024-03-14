import React from 'react'
import Inputbox from '../components/input.component'
import { FaGoogle } from 'react-icons/fa'
import {Link} from 'react-router-dom'

export default function UserAuthform({type}) {
  return (
    <div>
        <section className='h-cover flex items-center justify-center'>
            <form className='w-[80%] max-w-[400px]'>
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
              <button type='submit' className='flex items-center whitespace-nowrap bg-black text-white rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-90  block mx-auto mt-14'>
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
      
    </div>
  )
}
