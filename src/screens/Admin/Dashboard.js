import React, { useContext } from 'react'
import { logout } from '../../components/api/api';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import styles from '../../css/dashboard.module.css'
import { BiLogOut } from 'react-icons/bi'
import { FaCartArrowDown, FaWarehouse, FaHammer, FaPlusSquare } from 'react-icons/fa'
import { BsBook } from "react-icons/bs"
import { TbPackgeExport } from 'react-icons/tb'
const Dashboard = () => {

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    if (user) {
      await logout();
      secureLocalStorage.removeItem('user');
      navigate('/login');
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div id={styles.header}>
        <BiLogOut className={styles.logout} onClick={handleLogout} />
      </div>
      <div className={styles.contentContainer}>
        <button className={styles.button} 
          onClick={()=>{
            navigate("/admin/orders")
          }}>
          Ordini Ricevuti
          <FaCartArrowDown size={50} className={styles.buttonIcon} />
        </button>
        <button className={styles.button}
          onClick={() => {
            navigate('/admin/magazzino');
          }}
        >
          Magazzino
          <FaWarehouse size={50} className={styles.buttonIcon} />
        </button>
        <button className={styles.button}>
          In Produzione
          <FaHammer size={50} className={styles.buttonIcon} />
        </button>
        <button className={styles.button}>
          Evasi
          <TbPackgeExport size={50} className={styles.buttonIcon} />
        </button>
        <button className={styles.button}>
          Produci
          <FaPlusSquare size={50} className={styles.buttonIcon} />
        </button>
        <button className={styles.button}
          onClick={() => navigate("/admin/catalog")}
        >
          Catalogo Menù e Prodotti
          <BsBook size={50} color={'white'} className={styles.buttonIcon} />
        </button>
      </div>
    </div>
  )
}

export default Dashboard