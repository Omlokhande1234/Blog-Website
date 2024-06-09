import React from 'react'

export default function NavbarComponent() {
  return (
    <nav className='navbar'>
       <Link to='/' className='flex-none w-10'>
           <img src={logo} alt="logo" className='w-full'/>
       </Link>
    </nav>
  )
}
