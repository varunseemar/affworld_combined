import './App.css'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import PageNotFound from './pages/PageNotFound'
import ForgotPassword from './pages/forgotPassword'
import Dashbaord from './pages/dashbaord'
import ResetPassword from './pages/resetPassword'
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/Register' element={<Register />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashbaord />}></Route>
        <Route path='/' element={<Dashbaord />}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/resetpassword/:param' element={<ResetPassword />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </>
  )
}

export default App