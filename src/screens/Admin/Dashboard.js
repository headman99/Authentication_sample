import React, { useContext, useRef, useState } from 'react'
import { getTeams, logout } from '../../components/api/api';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import styles from '../../css/dashboard.module.css'
import { BiLogOut } from 'react-icons/bi'
import { FaCartArrowDown, FaWarehouse, FaHammer, FaPlusSquare } from 'react-icons/fa'
import { BsBook } from "react-icons/bs"
import { TbPackgeExport } from 'react-icons/tb'
import { useEffect } from 'react';
import { Audio } from 'react-loader-spinner';
import { GrUserSettings } from "react-icons/gr"

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [teams, setTeams] = useState();
  const [selectTeam, setSelectTeam] = useState('');


  const handleChangeteam = (newteam) => {
    console.log("selected = ", newteam)
    console.log("available=", teams)

    if (selectTeam === newteam)
      return
    if (!newteam)
      secureLocalStorage.removeItem("team");
    else
      secureLocalStorage.setItem("team", JSON.stringify(teams.find(t => t.name === newteam)))
    setSelectTeam(newteam)
  }

  const handleLogout = async () => {
    if (user) {
      await logout();
      secureLocalStorage.removeItem('user');
      navigate('/login');
    } else {
      alert("effettua il login")
      navigate("/login")
    }
  }

  useEffect(() => {
    let isApiSubscribed = true;
    (async () => {
      const item = secureLocalStorage.getItem('team')
      const currentTeam = item === 'undefined' ? item : JSON.parse(item)
      setSelectTeam(currentTeam?.name ? currentTeam.name : '')
      try {
        const tms = await getTeams();
        if (isApiSubscribed)
          setTeams([...tms.data])
      } catch (err) {
        console.log(err)
        console.log(err.response.data.message)
        if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
          alert("effettua il login")
          navigate("/login")
        }
      }
    })()

    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [])

  return (
    <div className={styles.mainContainer}>
      {
        !teams ?
          <div className='AudioContainer'>
            <Audio color='black' />
          </div>
          :
          <>
            <div id={styles.header}>
              <div style={{flex:0.1}} >
                <GrUserSettings className={styles.logout} size={45} onClick={() => navigate('users')}/>
              </div>
              <div >
                <select className={styles.select} value={selectTeam} onChange={e => handleChangeteam(e.target.value)} >
                  <option value={selectTeam}>
                    {selectTeam.length>30?`${selectTeam.slice(0,30)}...`:selectTeam}
                  </option>

                  {

                    teams.filter(e => e.name !== selectTeam).map(team => (
                      <option value={team.name} key={team.id} >
                        {team.name}
                      </option>
                    ))
                  }
                  <option value=''>

                  </option>
                </select>
              </div>

              <div style={{flex:0.1}}>
                <BiLogOut className={styles.logout} onClick={handleLogout} size={55}/>
              </div>

            </div>
            <div className={styles.contentContainer}>
              <button className={styles.button}
                onClick={() => {
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
              <button className={styles.button}
                onClick={() => navigate("/admin/production")}
              >
                In Produzione
                <FaHammer size={50} className={styles.buttonIcon} />
              </button>
              <button className={styles.button}
                onClick={() => navigate("/admin/evasi")}
              >
                Evasi
                <TbPackgeExport size={50} className={styles.buttonIcon} />
              </button>
              <button className={styles.button}
                onClick={() => navigate("/admin/calculator")}
              >
                Calcolatore
                <FaPlusSquare size={50} className={styles.buttonIcon} />
              </button>

              <button className={styles.button}
                onClick={() => navigate("/admin/catalog")}
              >
                Catalogo Menù e Prodotti
                <BsBook size={50} color={'white'} className={styles.buttonIcon} />
              </button>
            </div>
          </>
      }
    </div>
  )
}

export default Dashboard