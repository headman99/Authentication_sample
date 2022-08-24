import React,{useContext} from 'react'
import { api, logout, resetHeaders } from '../../../components/api/api';
import { UserContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
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
    <>
      <div>Dashboard</div>
      <button type='button' onClick={handleLogout} >logout</button>
    </>

  )
}

export default Dashboard