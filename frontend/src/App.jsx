import { Navigate, Route, Routes } from "react-router-dom"
import ChatUi from "./components/chatUi"

import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"

import Signup from "./pages/register";
import Login from "./pages/login";

function App() {
  const { checkAuth, token, isCheckingAuth, isLoading } = useAuthStore();


  useEffect(() => {
    checkAuth()

  }, [])

  if (isCheckingAuth) {
    return null//loading spinner 
  }

  if (isLoading) return


  return (
    <>
      <Routes>
        <Route path="/" element={!token ?  <Navigate to="/login" /> :<ChatUi /> } />
        <Route path="/login" element={ !token?<Login /> : <Navigate to="/" /> } />
        <Route path="/signup" element={!token?<Signup /> : <Navigate to="/" /> } />
     
      </Routes>


    </>
  )
}

export default App
