import React from 'react'
import{ useState,useEffect} from 'react';
import banner from '../images/banner.png'
import styles from './forgotPassword.module.css'
import{sendPasswordResetOTP, verifyOTP} from '../services/passwordManagement';
import{ useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const forgotPassword =()=>{
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const handleSendOtp = async(e)=>{
        e.preventDefault();
        if(!userEmail.trim()){
          toast.error('Email is required');
          return;
        }
        setLoading(true);
        try{
            let email = userEmail;
            const response = await sendPasswordResetOTP({email});
            if(response){
                toast.success('OTP sent to your email.');
                setOtpSent(true);
                setTimer(60);
            }
        } 
        catch(error){
          toast.error('Failed to send OTP. Please try again.');
        } 
        finally{
          setLoading(false);
        }
    };
    
    const handleVerifyOtp = async(e)=>{
        e.preventDefault();
        if(!otp.trim()){
          toast.error('OTP is required');
          return;
        }
        setLoading(true);
        try{
            const email = userEmail;
            const response = await verifyOTP({email, otp});
            if(response){
                toast.success('OTP verified. Redirecting...');
                navigate(`/resetpassword/${userEmail}`);
            }
        } 
        catch(error){
          toast.error('Invalid OTP. Please try again.');
        } 
        finally{
          setLoading(false);
        }
    };
    
    useEffect(()=>{
        if(timer > 0){
          const countdown = setInterval(()=> setTimer((prev)=> prev - 1), 1000);
          return()=> clearInterval(countdown);
        }
    }, [timer]);
  return(
    <div className={styles.forgotPassword}>
        <div className={styles.forgotPasswordform}>
            <p style={{fontFamily:"sans-serif",fontWeight:"600",marginBottom:"4vh",fontSize:"30px"}}>Forgot Password</p>
            <p style={{fontFamily:"sans-serif",marginTop:"15px",marginBottom:"30px"}}>Enter your email to receive an OTP and a reset link</p>
            <form onSubmit={handleSendOtp}>
                <input name='email' disabled={otpSent && timer > 0} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} type='email' placeholder='Email'></input>
                {!otpSent ?(
                    <button type='submit' disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                    ):(
                    <button type='submit' disabled={timer > 0 || loading}>
                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                    </button>
                )}
            </form>
            {otpSent &&(
                <div className={styles.otp}>
                    <input type="text" placeholder="Enter OTP" value={otp} onChange={(e)=> setOtp(e.target.value)} />
                    <button onClick={handleVerifyOtp} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <p>You can also reset your password using the link sent to your email</p>
                </div>
            )}
        </div>
        <div className={styles.forgotPasswordpic}>
            <img src={banner}></img>
        </div>
    </div>
  )
}

export default forgotPassword