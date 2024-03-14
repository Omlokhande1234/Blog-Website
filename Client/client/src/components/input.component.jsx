import React, { useState } from 'react'
import { FaUser , FaAt , FaKey , FaEye ,FaEyeSlash } from 'react-icons/fa'

export default function Inputbox({name , type , placeholder , id , value }) {

  const [passwordVisibility , setPasswordVisibility] =useState(false)
  

  return (
    <div className='relative w-full mb-4'>
      <input 
      type={type=="password" ? passwordVisibility ? "text" : "password" : type}
      placeholder={placeholder}
      name={name}
      defaultValue={value}
      id={id}
      className='w-[100%] rounded-md p-4 bg-grey pl-12 border border-grey focus:bg-transparent placeholder:text-black'
      />
      {
      type=='text'
       ? <FaUser className=' absolute left-4 top-1/2 -translate-y-1/2'/> 
       :""
       }

      {
      type=='mail'
       ?<FaAt className=' absolute left-4 top-1/2 -translate-y-1/2'/>
       :""
       }
      {
      type=='password'
       ?<FaKey className=' absolute left-4 top-1/2 -translate-y-1/2'/>
       :""
       }
      {
      type=='password'
       ?passwordVisibility?<FaEye
       onClick={()=>setPasswordVisibility((currentValue)=>!currentValue)}
        className='absolute top-1/2 -translate-y-1/2 left-auto right-4 cursor-pointer'/>
       :<FaEyeSlash
       onClick={()=>setPasswordVisibility((currentValue)=>!currentValue)}
        className='absolute  top-1/2 -translate-y-1/2 left-auto right-4 cursor-pointer'
        />: ""
       }
    </div>
  )
}