import React from 'react'
import logo from '../images/logo.png'
import userlogo from '../images/user.png'
import styles from './header.module.css'

const header = ({user}) => {
  return (
    <div className={styles.headermain}>
      <div className={styles.logo}>
        <img src={logo}></img>
      </div>
      <div className={styles.user}>
        <p>{user}</p>
        <img src={userlogo}></img>
      </div>
    </div>
  )
}

export default header