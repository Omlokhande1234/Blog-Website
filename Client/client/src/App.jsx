import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Navbar from './components/navbarComponent'
import UserAuthform from './pages/userAuthform.page'


function App() {
  
  return(
   <Routes>
    <Route path="/" element={<Navbar />}>
      <Route path="/signin" element={<UserAuthform type="sign-in"/> }  />
      <Route path="/signup" element={<UserAuthform type="sign-up"/>} />

    </Route>
   
   </Routes>
   
  )
}

export default App
