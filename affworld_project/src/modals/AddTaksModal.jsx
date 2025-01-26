import React from 'react'
import {useEffect,useRef,useState} from 'react'
import styles from './AddTaksModal.module.css'
import toast from 'react-hot-toast';
import { postTask } from '../services/taskManagement';

const AddTaskModal = ({closeAddTaskModal,displayAddTaskModal}) => {
const [loading,setLoading] = useState(false);
const [Errors,setErrors] = useState({
    title:"",
    description:"",
});
const [localTaskDetails, setLocalTaskDetails] = useState({
    title: '',
    description:'',
    creator:'',
});
const AddTaskModalContainerRef = useRef();

const handleTitleChange =(e)=>{
    setLocalTaskDetails(prev=>({...prev, title: e.target.value}));
};
const handledescriptionChange =(e)=>{
    setLocalTaskDetails(prev=>({...prev, description: e.target.value}));
};

const handleSave =async(e)=>{
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')
    let errors = {};
    if(!localTaskDetails.title || localTaskDetails.title.trim() === ""){
        errors.title = "Title is Required";
        toast.error("Title is Required");
    }
    if(!localTaskDetails.description || localTaskDetails.description.trim() === ""){
        errors.description = "Description is Required";
        toast.error("Description is Required");
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }    
    try{
        if(localTaskDetails){
            let taskDetails = localTaskDetails;
            const response = await postTask({taskDetails,email,token})
            if(response.status === 200){
                toast.success("Task Created Successfully")
                closeAddTaskModal();
            }
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
    if(displayAddTaskModal && AddTaskModalContainerRef.current && !AddTaskModalContainerRef.current.contains(e.target)){
        closeAddTaskModal();
    }
}
useEffect(()=>{
    if(displayAddTaskModal){
        setLocalTaskDetails({
            title: '',
            description: '',
        });
    }
},[displayAddTaskModal]);

useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayAddTaskModal])

  return(
    <div className={styles.AddTaskModalContainer} ref={AddTaskModalContainerRef}>
        <div className={styles.headingaddtask}>
            <p>Add Task Details</p>
        </div>
        <div className={styles.tasktitlediv}>
            <div className={styles.AddTaskTitlestar}><p className={styles.AddTaskTitle}>Title</p>&nbsp;<p className={styles.redstar}>*</p></div>
            <input type='text' placeholder='Enter Task Title' className={styles.AddTaskTitleInput} value={localTaskDetails.title} onChange={handleTitleChange}></input>
        </div>
        <div className={styles.taskdescriptiondiv}>
            <div className={styles.AddTaskdescriptionstar}><p className={styles.AddTaskdescription}>Description</p>&nbsp;<p className={styles.redstar}>*</p></div>
            <textarea type='text' placeholder='Enter Task Description' className={styles.AddTaskdescriptionInput} value={localTaskDetails.description} onChange={handledescriptionChange}></textarea>
        </div>
        <div className={styles.taskbuttonsdiv}>
            <button className={styles.AddTaskCancelButton} onClick={() => {closeAddTaskModal()}}>Cancel</button>
            <button disabled={loading} className={styles.AddTaskSaveButton} onClick={handleSave}>Save</button>
        </div>
    </div>
  )
}

export default AddTaskModal;