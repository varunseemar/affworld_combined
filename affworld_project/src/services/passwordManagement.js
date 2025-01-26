import axios from 'axios'
import { BACKEND_URL } from '../constants/constant'

export const sendPasswordResetOTP  = async ({email})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/password/forgotpassword`,{
            email,
        },{ 
            headers:{
            'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const verifyOTP = async ({email,otp})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/password/verifyotp`,{
            email,
            otp,
        },{ 
            headers:{
            'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const ResetPassword = async (data)=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/password/resetpassword`,data,{ 
            headers:{
            'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const ValidateToken  = async ({token})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/password/validatetoken`,{
            token,
        },{ 
            headers:{
            'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}