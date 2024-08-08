import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Navbar from "./components/navbar/Navbar";
import ProfileEdit from "./pages/ProfileEdit";
import SignIn from "./pages/SignIn";
import { useEffect, useState } from "react";
import { auth } from "./components/firebase";
import Loading from "./pages/Loading";

function App() {

  const [loading,setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(()=>{
   const authChange = auth.onAuthStateChanged(user=>{
     
      setLoading(false)
      if(user){
         window.location.pathname === '/login' && navigate('/')     
      }
      else{
        window.location.pathname !== '/login' && navigate('/login')
      }
    })
     return authChange;
  },[navigate])

  if(loading){
    return <Loading/>
  }

  return (
    <>
      {window.location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/login" element={ <SignIn/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit/>} />
      </Routes>
    </>
  );
}

export default App;
