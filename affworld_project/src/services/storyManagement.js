import axios from 'axios'
import { BACKEND_URL } from '../constants/constant'

export const postStory = async ({formData,token})=>{
    try{
        for(let [key, value] of formData.entries()){
            console.log(`${key}:`, value);
        }
        const response = await axios.post(`${BACKEND_URL}/api/story/Post`,formData,
        {
            headers:{
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data);
    }
}

export const fetchStories = async () => {
    try{
        const response = await axios.get(`${BACKEND_URL}/api/story/AllStories`);
        return response;
    }
    catch(error){
        throw new Error(err.response.data);
    }
};

export const fetchViewStory = async ({viewStoryId}) => {
    try{
        const id = viewStoryId;
        const response = await axios.get(`${BACKEND_URL}/api/story/fetchStory/${id}`);
        return response;
    }
    catch(error){
        throw new Error(err.response.data);
    }
};