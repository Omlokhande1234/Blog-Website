import { Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/navbarComponent";
import UserAuthForm from "./pages/UserAuthForm";

const App = () => {
  return (
    <Routes>
     
         <Route path="/" element={<NavbarComponent/>}>
            <Route path="/sign-in" element={<UserAuthForm  type={'sign-in'}/>}/>
            <Route path="/sign-up" element={<UserAuthForm type={'sign-up'}/>}/>
             
         </Route>
            
          
    </Routes>
    
      
  )
}

export default App;