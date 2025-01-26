import React from 'react'
import styles from './resetPassword.module.css'
import { useState , useEffect} from 'react';
import bannerPic from '../images/banner.png'
import { ResetPassword, ValidateToken } from '../services/passwordManagement';
import { useNavigate ,useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const resetPassword = () => {
    const { param } = useParams();
    const navigate = useNavigate()
    const [validToken, setValidToken] = useState(false);
    const [loading,setLoading] = useState(false);
    const [userData,setUserData] = useState({
        password:'',
        confirmPassword:'',
    })
    const [Errors,setErrors] = useState({
        password:"",
        confirmPassword:"",
        passwordMatch:"",
    });
    useEffect(() => {
        if (!param.includes('@')) {
          (async () => {
            try{
                const token = param;
                const response = await ValidateToken({token});
                if(response.status === 200){
                    setValidToken(true);
                }
            } 
            catch(err){
                toast.error('Invalid or expired token.');
                navigate('/forgotpassword');
            }
          })();
        }
    }, [param, navigate]);
    const handleChange = (e)=>{
        setUserData({
            ...userData,
            [e.target.name] : e.target.value
        })
    }
    const handleResetPassword = async (e)=>{
        e.preventDefault();
        setLoading(true);
        let errors = {};
        if(!userData.confirmPassword || userData.confirmPassword.trim() === ""){
            errors.confirmPassword = "Confirm Password is Required"
            toast.error('Confirm Password is Required');
        }
        if(!userData.password || userData.password.trim() === ""){
            errors.password = "Password is Required"
            toast.error('Password is Required');
        }
        if(userData.password !== userData.confirmPassword){
            errors.passwordMatch = "Passwords do not match"
            toast.error('Passwords do not match');
        }
        setErrors(errors);
        if(Object.keys(errors).length > 0){
            setLoading(false);
            return;
        }
        try{
            const {password} = userData;
            if(validToken){
                const response = await ResetPassword({ token: param, password });
                if(response.status === 200){
                  toast.success('Password reset successfully');
                  navigate('/login');
                }
            } 
            else{
                const response = await ResetPassword({ email: param, password });
                if(response.status === 200){
                  toast.success('Password reset successfully');
                  navigate('/login');
                }
            }
        }
        catch(err){
            toast.error('Failed to reset password. Please try again');
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div className={styles.resetPassword}>
        <div className={styles.form}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"4vh",fontSize:"30px"}}>Reset Password</p>
            <form onSubmit={handleResetPassword}>
                <input name='password' value={userData.password} onChange={handleChange} type='password' placeholder='Password' ></input>
                <input name='confirmPassword' value={userData.confirmPassword} onChange={handleChange} type='password' placeholder='Confirm Password' ></input>
                <button disabled={loading} type='submit' >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
        <div className={styles.pic}>
            <img src={bannerPic}></img>
        </div>
    </div>
  )
}

export default resetPassword;