import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import {Route,Routes,Navigate} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import { Loader } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
function App() {

  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();

    useEffect(()=>{
        checkAuth()
  },[checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-center h-screen'>
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ? <Home/>: <Navigate to={"/login"}/>}/>
        <Route path="/login" element={ !authUser ? <Login/> :<Navigate to={"/"}/> }/>
        <Route path="/signup" element={!authUser ? <SignUp/>: <Navigate to={"/"}/>} />
      </Routes > 
      </div>
    </>
  )
}

export default App
