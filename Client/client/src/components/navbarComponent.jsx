import React, { useState } from 'react'
import logo from '../imgs/logo.png';
import {Link, Outlet} from 'react-router-dom'
import { FiSearch } from "react-icons/fi";
import{FaFile} from  'react-icons/fa' 

export default function Navbar() {
  const[SearchBoxVisibility, setSearchboxvisibility] = useState(false)
  return (
    <>
    <nav className='z-10 sticky top-0 flex items-center 
    gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-grey
     bg-white'>
          <Link to='/' className='flex-none w-10'>
              <img className='h-full object-cover flex-none w-10' src={logo} alt="Logo" />
          </Link>
          <div className={"absolute bg-white w-full top-full left-0 mt-0.5 border-b border-grey py-4 px-[5vh] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:opacity-100 pointer-events-auto " + (SearchBoxVisibility ? "opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none duration-100")}>
          
            <input type="text"
                   placeholder='Search...'
                   className="w-full md:w-auto bg-gray-100 p-4 pl-6 pr-[12%] md:pr-6
                    rounded-full md:pl-12
                   placeholder:text-gray-500"
            
            /> 
            <FiSearch className='absolute right-[10%] md:pointer-events-none md:left-5 
            top-1/2 -translate-y-1/2 text-xl text-gray-500' />

          </div>
          <div className='flex items-center gap-3 md:gap-6 ml-auto '>
            <button className='md:hidden bg-gray-100 w-12 h-12 rounded-full flex
            items-center justify-center  ' 
            onClick={()=>setSearchboxvisibility(currentVal=>!currentVal)} >
              {/* IF THE CURRENT VAL IS TRUE IT WILL CHANGE IT TO FALSE AND IF FALSE THEN TO TRUE */}
              <FiSearch className='text-2xl' />

            </button>
            <Link 
               className='md:flex gap-2 link hidden'
               to='/editor'>
               <FaFile />
               <p>Write</p>
            </Link>
            <Link to='/signin' className=' whitespace-nowrap bg-black text-white rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-90'>
                Sign in
            </Link>
            <Link to='/signup' className='bg-gray-100 text-black whitespace-nowrap   rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-90'>
                Sign up
            </Link>

          </div>
        </nav>
        <Outlet/>
  
    </>
  )
}
