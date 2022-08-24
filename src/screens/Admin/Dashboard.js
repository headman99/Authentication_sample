import React,{useContext} from 'react'
import {logout } from '../../components/api/api';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import styles from '../../css/dashboard.module.css'
const Dashboard = () => {

  const {user} = useContext(UserContext);
  const navigate= useNavigate();
  const  handleLogout= async ()=>{
    if(user){
      await logout();
      secureLocalStorage.removeItem('user');
      navigate('/login');
    }  
  }
 
  return (
      <div id="mainContainer">
        <div id="header"></div>
        <div id='mainContent'>
          <button className={styles.button}>Ordini Ricevuti</button>
          <button className={styles.button}>Ingredienti</button>
        </div>
      </div>
  )
}

export default Dashboard