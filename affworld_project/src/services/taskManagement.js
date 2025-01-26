import axios from 'axios'
import { BACKEND_URL } from '../constants/constant'

export const postTask = async ({taskDetails,email,token})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/api/task/Post`,{
            taskDetails,
            email,
        },
        {
            headers:{
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const fetchUserTasks = async ({email})=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/api/task/usertasks`,{
            params: {email}
        });
        return response.data;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const updateTaskStatus = async ({taskId,newStatus}) => {
    try{
      const response = await axios.patch(`${BACKEND_URL}/api/task/updateStatus`,
        { 
            taskId, 
            newStatus 
        },
        {
            headers:{
            'Content-Type': 'application/json',
            },
        }
      );
      return response.data;
    }
    catch(err){
      throw new Error(err.response.data);
    }
};

export const deleteTask = async ({taskId}) => {
    try{
      const response = await axios.delete(`${BACKEND_URL}/api/task/Delete/${taskId}`);
      return response;
    }
    catch(err){
      throw new Error(err.response.data);
    }
};