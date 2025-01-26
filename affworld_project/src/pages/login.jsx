import React from 'react'
import styles from './login.module.css'
import { useState } from 'react';
import bannerPic from '../images/banner.png'
import { GoogleLogin } from '@react-oauth/google';
import { loginUser } from '../services/userAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false);
    const [userData,setUserData] = useState({
        email:'',
        password:'',
    })
    const [Errors,setErrors] = useState({
        wrongEmailpass:"",
        accessDenied:"",
        email:"",
        password:"",
    });
    // const handleGoogleSuccess = async (response) => {
    //     try {
    //         const result = await axios.post(`${BACKEND_URL}/api/auth/googlelogin`, {
    //             token: response.tokenId
    //         });

    //         if (result.status === 200) {
    //             const { token, email } = result.data;
    //             localStorage.setItem('token', token);
    //             localStorage.setItem('email', email);
    //             toast.success('Successfully Logged In');
    //             navigate('/dashboard');
    //         }
    //     } catch (error) {
    //         toast.error('Google Login Failed');
    //         console.error(error);
    //     }
    // };
    // const handleGoogleFailure = (error) => {
    //     toast.error('Google Login Failed');
    //     console.error(error);
    // };
    const handleChange = (e)=>{
        setUserData({
            ...userData,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        let errors = {};
        if(!userData.email || userData.email.trim() === ""){
            errors.email = "Email is Required"
            toast.error('Email is Required');
        }
        if(!userData.password || userData.password.trim() === ""){
            errors.password = "Password is Required"
            toast.error('Password is Required');
        }
        setErrors(errors);
        if(Object.keys(errors).length > 0){
            setLoading(false);
            return;
        }
        try{
            const {email,password} = userData;
            const response = await loginUser({email,password})
            if(response.status === 200){
                toast.success('Successfully Logged In');
                const {data} = response;
                localStorage.setItem('email', email)
                localStorage.setItem('token', data.token)
                navigate('/dashboard');
            }
        }
        catch(err){
            if(err.message === "Wrong Email or Password"){
                errors.wrongEmailpass = "Wrong Email or Password";
                toast.error('Wrong Email or Password');
                setErrors(errors);
            }
            if(err.message === "Acces Denied"){
                errors.accessDenied = "Access Denied";
                toast.error('Access Denied');
                setErrors(errors);
            }
            console.log(err.message)
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div className={styles.register}>
        <div className={styles.form}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"4vh",fontSize:"30px"}}>Already have an account?</p>
            <form onSubmit={handleSubmit}>
                <input name='email' value={userData.email} onChange={handleChange} type='email' placeholder='Email'></input>
                <input name='password' value={userData.password} onChange={handleChange} type='password' placeholder='Password' style={{marginBottom:"0vh"}}></input>
                <button disabled={loading} type='submit'>Sign In</button>
                {/* <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} buttonText="Sign in with Google" onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} cookiePolicy={'single_host_origin'}/> */}
            </form>
            <p style={{fontFamily:"sans-serif",marginTop:"25px",marginLeft:"5px"}}>Don’t have an account?&nbsp;&nbsp;<a href='/Register' style={{color:"black",fontWeight:"600"}}>Sign Up</a></p>
            <a href='/forgotPassword' style={{color:"black",fontWeight:"600",marginLeft:"0.3vw"}}>Forgot Password ?</a>
        </div>
        <div className={styles.pic}>
            <img src={bannerPic}></img>
        </div>
    </div>
  )
}

export default Login;