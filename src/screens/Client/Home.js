import React, { useCallback, useRef, useEffect, useState } from 'react'
import styles from "../../css/home.module.css"
import { Audio } from 'react-loader-spinner'
import { getMenuDetails, addOrderMenu } from '../../components/api/api'
import MenuCard from '../../components/MenuCard'
import { BiLogOut } from 'react-icons/bi'
import { logout } from "../../components/api/api"
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import { useContext } from 'react'
import { UserContext } from '../../App'
import { MenuAlternativesContext } from '../../Routes/ClientRoutes'

const Home = () => {

  const [menus, setMenus] = useState()
  const navigate = useNavigate()
  const { user } = useContext(UserContext);
  const choosenMenu = useRef([])
  const { contextRecipe } = useContext(MenuAlternativesContext);
  const [wait,setWait] = useState(false)

  const handleChangeRequest = useCallback((data) => {
    if (choosenMenu.current.find(menu => menu.menu_id === data.menu_id)?.richiesta === data.richiesta) {
      return
    }
    if (choosenMenu.current.map(menu => menu.menu_id).includes(data.menu_id)) {
      let temp = choosenMenu.current.filter(menu => menu.menu_id !== data.menu_id)
      const { richiesta, ...rest } = choosenMenu.current.find(menu => menu.menu_id === data.menu_id)
      if (data?.richiesta)
        temp.push({
          ...rest,
          richiesta: data.richiesta
        })
      else
        if (rest?.quantity && rest?.date) {
          temp.push({
            ...rest
          })
        }

      choosenMenu.current = temp
    } else {
      if (data?.quantity && data?.date)
        choosenMenu.current.push(data)
    }
  }, [])

  const handleChangeMenuQuantity = useCallback((data) => {
    const index = choosenMenu.current.findIndex(el => el.menu_id === data.menu_id);
    if (index === -1) {
      choosenMenu.current = [...choosenMenu.current, { ...data }]
      return
    }

    if (choosenMenu.current[index]?.quantity === data?.quantity)
      return;

    choosenMenu.current[index] = { ...choosenMenu.current[index], quantity: data?.quantity }

    if ((isNaN(choosenMenu.current[index]?.quantity) || !choosenMenu.current[index]?.quantity) && (!choosenMenu.current[index]?.date || choosenMenu.current[index]?.date === ''))
      choosenMenu.current.splice(index, 1)

  }, [])

  const handleChangeMenuDate = useCallback((data) => {
    const index = choosenMenu.current.findIndex(el => el.menu_id === data.menu_id);
    if (index === -1) {
      choosenMenu.current = [...choosenMenu.current, { ...data }]
      return
    }

    if (choosenMenu.current[index]?.date === data?.date)
      return;

    choosenMenu.current[index] = { ...choosenMenu.current[index], date: data?.date }

    if ((isNaN(choosenMenu.current[index]?.quantity) || !choosenMenu.current[index]?.quantity) && (!choosenMenu.current[index]?.date || choosenMenu.current[index]?.date === ''))
      choosenMenu.current.splice(index, 1);
  }, [])


  const checkValidity = () => {
    const quantities = choosenMenu.current.map(menu => menu.quantity)
    const dates = choosenMenu.current.map(menu => menu.date)
    if (quantities.includes(undefined) || quantities.includes(null))
      return {
        state: false,
        error: "Specificare la quantità desiderata per ogni menù selezionato"
      }
    if (dates.includes(undefined) || dates.includes(null) || dates.includes(''))
      return {
        state: false,
        error: "Specificare la data desiderata per ogni menù selezionato"
      }

    return {
      state: true,
      message: 'ok'
    }
  }

  const handleClickConfirm = () => {
    const allow = window.confirm("Inviare l'ordine");
    if(!allow)
      return

    if (choosenMenu.current.length === 0)
      return

    const { state, error } = checkValidity();

    if (!state) {
      alert(error)
      return
    }

    let data = choosenMenu.current.map(el => {
      let alternative = [];
      if (contextRecipe.current.length>0) {
        alternative = new Set([...contextRecipe.current.find(i => i.menu.id === el.menu_id)?.products.filter(e => e.alternative !== null).map(s => ({
          alternative: s.alternative,
          gruppo: s.gruppo,
          sezione: s.sezione?s.sezione:''
        }))]);
      }


      return ({
        ...el,
        alternative:[...alternative]
      });
    });

    setWait(true)
    addOrderMenu({
      data: data
    }).then(resp => {
        alert("Richiesta inviata con successo")
        window.location.reload()
      
    }).catch(err => {
      console.log(err)
      alert(err.response.data.message)
    }).finally(() => {
      setWait(false);
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
        wait && <div className={styles.modal}></div>
      }
      {
        !menus ?
          <div className="AudioContainer">
            <Audio color="black" />
          </div>
          :
          <>

            <div id={styles.header}>
              <BiLogOut className={styles.logout} onClick={handleLogout} size={50} />
            </div>

            <div className={styles.carusel}>
              {
                menus.map((menu, index) =>
                  <MenuCard
                    key={index}
                    handleChangeMenuQuantity={handleChangeMenuQuantity}
                    handleChangeRequest={handleChangeRequest}
                    handleChangeMenuDate={handleChangeMenuDate}
                    menu={menu} />)
              }
            </div>
            <div style={{ display: 'block', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="button"
                style={{ width: 150 }}
                onClick={handleClickConfirm}
              > Conferma</button>
            </div>
          </>
      }

    </div>
  )
}

export default Home