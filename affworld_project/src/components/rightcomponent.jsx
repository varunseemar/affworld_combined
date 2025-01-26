import React from 'react'
import styles from './rightcomponent.module.css'
import TaskManager from './taskManager'
import FeedSection from './feedSection'
import { useEffect } from 'react'

const rightcomponent = ({selectedMenu,openAddTaskModal,openDeleteModal,setDeleteTaskId,refresh,openAddStoryModal, openViewStoryModal, setViewStoryId}) => {
  useEffect(() => {
    console.log('RightComponent refreshed');
  },[refresh]);
  return (
    <div className={styles.rightcomponentMain}>
      {selectedMenu === 'task' ? 
        <TaskManager openAddTaskModal={openAddTaskModal} openDeleteModal={openDeleteModal} setDeleteTaskId={setDeleteTaskId} refresh={refresh}/> :
        <FeedSection openAddStoryModal={openAddStoryModal} openViewStoryModal={openViewStoryModal} setViewStoryId={setViewStoryId} refresh={refresh}/>
      }
    </div>
  )
}

export default rightcomponent