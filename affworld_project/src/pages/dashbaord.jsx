import React from 'react'
import { useState,useEffect } from 'react'
import Header from '../components/header'
import Leftcomponent from '../components/leftcomponent'
import Rightcomponent from '../components/rightcomponent'
import styles from './dashboard.module.css'
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/userAuth'
import LogoutModal from '../modals/LogoutModal'
import AddTaskModal from '../modals/AddTaksModal'
import DeleteModal from '../modals/Delete'
import AddStoryModal from '../modals/AddStoryModal'
import ViewStoryModal from '../modals/DisplayStory'

const dashbaord = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(localStorage.getItem('menu') || 'task');
  const [deleteTaskId,setDeleteTaskId] = useState('');
  const [isModalOpen,setIsModalOpen] = useState();
  const [displayLogoutModal,setDisplayLogoutModal] = useState(false);
  const [displayDeleteModal,setDisplayDeleteModal] = useState(false);
  const [displayAddStoryModal,setDisplayAddStoryModal] = useState(false);
  const [displayViewStoryModal,setDisplayViewStoryModal] = useState(false);
  const [displayAddTaskModal,setDisplayAddTaskModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [viewStoryId,setViewStoryId] = useState(0);

  function openLogoutModal(){
    setDisplayLogoutModal(true);
    setIsModalOpen('Logout');
  }
  function closeLogoutModal(){
    setDisplayLogoutModal(false);
    setIsModalOpen();
  }
  function openDeleteModal(){
    setDisplayDeleteModal(true);
    setIsModalOpen('Delete');
  }
  function closeDeleteModal(){
    setDisplayDeleteModal(false);
    setIsModalOpen();
    setRefresh((prev) => prev + 1);
  }
  function openAddStoryModal(){
    setDisplayAddStoryModal(true);
    setIsModalOpen('AddStory');
  }
  function closeAddStoryModal(){
    setDisplayAddStoryModal(false);
    setIsModalOpen();
    setRefresh((prev) => prev + 1);
  }
  function openViewStoryModal(){
    setDisplayViewStoryModal(true);
    setIsModalOpen('ViewStory');
  }
  function closeViewStoryModal(){
    setDisplayViewStoryModal(false);
    setIsModalOpen();
  }
  function openAddTaskModal(){
    setDisplayAddTaskModal(true);
    setIsModalOpen('AddTask');
  }
  function closeAddTaskModal(){
    setDisplayAddTaskModal(false);
    setIsModalOpen();
    setRefresh((prev) => prev + 1);
  }
  useEffect(() => {
    const fetchUser = async (email) => {
      try{
        const response = await getUser({ email });
        setUser(response.data.name);
      } 
      catch(error){
        console.log(error)
      }
    }
    if(localStorage.getItem('email')){
      const email = localStorage.getItem('email');
      fetchUser(email);
    }
    else{
      navigate('/login');
    }
  }, [])
  return (
    <>
      {isModalOpen === 'Logout' && displayLogoutModal
        ? <div className={styles.LogoutModal}> <LogoutModal closeLogoutModal={closeLogoutModal} displayLogoutModal={displayLogoutModal} /> </div> 
        : ""}
      {isModalOpen === 'Delete' && displayDeleteModal
        ? <div className={styles.DeleteModal}> <DeleteModal closeDeleteModal={closeDeleteModal} displayDeleteModal={displayDeleteModal} deleteTaskId={deleteTaskId} /> </div> 
        : ""}
      {isModalOpen === 'AddStory' && displayAddStoryModal
        ? <div className={styles.AddStoryModal}> <AddStoryModal closeAddStoryModal={closeAddStoryModal} displayAddStoryModal={displayAddStoryModal}/> </div> 
        : ""}
      {isModalOpen === 'ViewStory' && displayViewStoryModal
        ? <div className={styles.ViewStoryModal}> <ViewStoryModal closeViewStoryModal={closeViewStoryModal} displayViewStoryModal={displayViewStoryModal} viewStoryId={viewStoryId}/> </div> 
        : ""}
      {isModalOpen === 'AddTask' && displayAddTaskModal
        ? <div className={styles.AddTaskModal}> <AddTaskModal closeAddTaskModal={closeAddTaskModal} displayAddTaskModal={displayAddTaskModal} /> </div> 
        : ""}
      <div className={styles.dashboardmain}>
        <div className={styles.headermain}>
          <Header user={user} />
        </div>
        <div className={styles.maincontent}>
          <div className={styles.leftcomponent}>
            <Leftcomponent openLogoutModal={openLogoutModal} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
          </div>
          <div className={styles.rightcomponent}>
            <Rightcomponent selectedMenu={selectedMenu} openAddTaskModal={openAddTaskModal} openDeleteModal={openDeleteModal} setDeleteTaskId={setDeleteTaskId} refresh={refresh} openAddStoryModal={openAddStoryModal} openViewStoryModal={openViewStoryModal} setViewStoryId={setViewStoryId}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default dashbaord