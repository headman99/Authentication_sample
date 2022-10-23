import React, { useCallback, useRef,useEffect, useState } from 'react'
import styles from "../../css/home.module.css"
import { Audio } from 'react-loader-spinner'
import { getMenuDetails,addOrderMenu } from '../../components/api/api'
import MenuCard from '../../components/MenuCard'
import { BiLogOut } from 'react-icons/bi'
import { logout } from "../../components/api/api"
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import { useContext } from 'react'
import { UserContext } from '../../App'

const Home = () => {

  const [menus, setMenus] = useState()
  const navigate = useNavigate()
  const { user } = useContext(UserContext);
  const choosenMenu = useRef([])

  const handleChangeMenuQuantity = useCallback((data)=>{
    if(choosenMenu.current.includes(data)){
      return
    }
    if(choosenMenu.current.map(menu => menu.menu_id).includes(data.menu_id)){
      let temp = choosenMenu.current.filter(menu => menu.menu_id!==data.menu_id)
      temp.push(data)
      choosenMenu.current = temp
    }else{
      choosenMenu.current.push(data)
    }
  },[])

  const handleClickConfirm = () => { 
    console.log(choosenMenu.current) 
    if(choosenMenu.current.length===0)
      return
      addOrderMenu({
        data:choosenMenu.current
      }).then(resp =>{
        if(resp.data.state == 1){
          alert("Richiesta inviata con successo")
        }
      }).catch(err =>{
        console.log(err)
        alert(err.response.data.message)
      })
    }
  

  const handleLogout = async () => {
    if (user) {
      await logout();
      secureLocalStorage.removeItem('user');
      navigate('/login');
    }
  }

  useEffect(() => {
    getMenuDetails().then((resp) => {
      if (resp.data?.menus) {
        setMenus(resp.data.menus)
      }
    }).catch((err) => {
      console.log(err)
      alert(err.response.data)
    })
  }, [])

  return (
    <div className={styles.mainContainer}>
      {
        !menus ?
          <div className="AudioContainer">
            <Audio color="black" />
          </div>
          :
          <>

            <div id={styles.header}>
              <BiLogOut className={styles.logout} onClick={handleLogout} size={50}/>
            </div>

            <div className={styles.carusel}>
              {
                menus.map((menu) => <MenuCard key={menu.id} handleChangeMenuQuantity={handleChangeMenuQuantity} menu={menu} />)
              }
            </div>
            <div style={{ display: 'block', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="button"
                onClick={handleClickConfirm}
              > Conferma</button>
            </div>
          </>
      }

    </div>
  )
}

export default Home