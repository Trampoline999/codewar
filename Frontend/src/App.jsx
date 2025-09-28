import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import {Route,Routes,Navigate} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import { Loader } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import  Layout  from './layout/Layout';
import AdminRoute from './components/AdminRoute';
import AddProblem from './pages/AddProblem';
import HomePage from './pages/HomePage';
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
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          </Route>
        <Route path="/login" element={ !authUser ? <LoginPage/> :<Navigate to={"/"}/> }/>
        <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to={"/"}/>} />

        <Route element={<AdminRoute/>} >
          <Route path='/add-problem' element={authUser ? <AddProblem /> : <Navigate to="/" />}/> 
        </Route>
      </Routes > 
      </div>
    </>
  )
}

export default App
