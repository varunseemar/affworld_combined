import React from 'react'
import {useEffect,useRef,useState} from 'react'
import styles from './AddStoryModal.module.css'
import toast from 'react-hot-toast';
import { postStory } from '../services/storyManagement';

const AddStoryModal = ({closeAddStoryModal,displayAddStoryModal}) => {
const [loading,setLoading] = useState(false);
const [Errors,setErrors] = useState({
    title:"",
    description:"",
    image:"",
});
const [imageFile, setImageFile] = useState(null);
const [localStoryDetails, setLocalStoryDetails] = useState({
    title: '',
    description:'',
    creator:'',
});
const AddStoryModalContainerRef = useRef();

const handleTitleChange =(e)=>{
    setLocalStoryDetails(prev=>({...prev, title: e.target.value}));
};
const handledescriptionChange =(e)=>{
    setLocalStoryDetails(prev=>({...prev, description: e.target.value}));
};
const handleImageChange =(e)=>{
    setImageFile(e.target.files[0]);
};

const handleSave =async(e)=>{
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')
    let errors = {};
    if(!localStoryDetails.title || localStoryDetails.title.trim() === ""){
        errors.title = "Title is Required";
        toast.error("Title is Required");
    }
    if(!localStoryDetails.description || localStoryDetails.description.trim() === ""){
        errors.description = "Description is Required";
        toast.error("Description is Required");
    }
    if(!imageFile){
        errors.image = "Image is Required";
        toast.error("Image is Required");
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }    
    try{
        const formData = new FormData();
        formData.append('heading', localStoryDetails.title);
        formData.append('description', localStoryDetails.description);
        formData.append('creator', email);
        formData.append('image', imageFile);
        const response = await postStory({formData, token});
        if(response.status === 200){
            toast.success('Story Created Successfully');
            closeAddStoryModal();
        }
    } 
    catch(error){
        console.log(error.message)
    }
    finally{
        setLoading(false);
    }
};
function checkClickOutside(e){
    if(displayAddStoryModal && AddStoryModalContainerRef.current && !AddStoryModalContainerRef.current.contains(e.target)){
        closeAddStoryModal();
    }
}
useEffect(()=>{
    if(displayAddStoryModal){
        setLocalStoryDetails({
            title: '',
            description: '',
        });
    }
},[displayAddStoryModal]);

useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayAddStoryModal])

  return(
    <div className={styles.AddStoryModalContainer} ref={AddStoryModalContainerRef}>
        <div className={styles.headingaddstory}>
            <p>Add Story Details</p>
        </div>
        <div className={styles.storytitlediv}>
            <div className={styles.AddStoryTitlestar}><p className={styles.AddStoryTitle}>Title</p>&nbsp;<p className={styles.redstar}>*</p></div>
            <input type='text' placeholder='Enter Story Title' className={styles.AddStoryTitleInput} value={localStoryDetails.title} onChange={handleTitleChange}></input>
        </div>
        <div className={styles.storydescriptiondiv}>
            <div className={styles.AddStorydescriptionstar}><p className={styles.AddStorydescription}>Description</p>&nbsp;<p className={styles.redstar}>*</p></div>
            <textarea type='text' placeholder='Enter Story Description' className={styles.AddStorydescriptionInput} value={localStoryDetails.description} onChange={handledescriptionChange}></textarea>
        </div>
        <div className={styles.storyimagediv}>
            <div className={styles.AddStoryImagestar}><p className={styles.AddStoryImage}>Uplaod Image</p>&nbsp;<p className={styles.redstar}>*</p></div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className={styles.storybuttonsdiv}>
            <button className={styles.AddStoryCancelButton} onClick={() => {closeAddStoryModal()}}>Cancel</button>
            <button disabled={loading} className={styles.AddStorySaveButton} onClick={handleSave}>Save</button>
        </div>
    </div>
  )
}

export default AddStoryModal;