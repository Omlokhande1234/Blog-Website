import { createContext, useState,useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import Navbar from './components/navbarComponent'
import UserAuthform from './pages/userAuthform.page'
import { lookInSession } from './Common/session'


export const UserContext=createContext({})
function App() {
  const[userAuth,setUserAuth]=useState({})

  useEffect(()=>{
    let userInSession=lookInSession("user");

    {
      userInSession 
      ? setUserAuth(JSON.parse(userInSession)) 
      : setUserAuth({token : null})
    }

  },[])
  
  return(
    <UserContext.Provider value={{userAuth,setUserAuth}}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/signin" element={<UserAuthform type="sign-in"/> }  />
          <Route path="/signup" element={<UserAuthform type="sign-up"/>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}

export default App
