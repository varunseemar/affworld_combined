import React from 'react'
import { useState,useEffect } from 'react';
import feed from '../images/feed.png'
import task from '../images/task.png'
import logout from '../images/logout.png'
import styles from './leftcomponent.module.css'

const leftcomponent = ({openLogoutModal,selectedMenu,setSelectedMenu}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem('menu',menu);
  };
  const handleLogout = () => {
    openLogoutModal();
  };
  return (
    <div className={`${styles.leftComponentMain} ${isCollapsed ? styles.collapsed : ''}`} onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)}>
      <div className={styles.menutext}>
        MENU
      </div>
      <div className={`${styles.menutask} ${selectedMenu === 'task' ? styles.selected : ''}`} onClick={() => handleMenuClick('task')}>
        <img src={task}></img>
        {!isCollapsed && <span>Task</span>}
      </div>
      <div className={`${styles.menufeed} ${selectedMenu === 'feed' ? styles.selected : ''}`} onClick={() => handleMenuClick('feed')}>
        <img src={feed}></img>
        {!isCollapsed && <span>Feed</span>}
      </div>
      <div className={styles.menulogout} onClick={handleLogout}>
        <img src={logout}></img>
        {!isCollapsed && <span>Logout</span>}
      </div>
    </div>
  )
}

export default leftcomponent;