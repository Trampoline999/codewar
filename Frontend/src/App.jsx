import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import {Route,Routes,Navigate} from "react-router-dom"
function App() {

  let authUser = null;

  return (
    <>
      <div className='flex items-center justify-center h-screen'>
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
