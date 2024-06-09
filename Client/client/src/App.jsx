import { Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/navbarComponent";

const App = () => {
  return (
    <Routes>
     
      <Route path="/" element={<NavbarComponent/>}/>
      
    </Routes>
      
  )
}

export default App;