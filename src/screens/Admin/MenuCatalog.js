import React, { useEffect, useState } from 'react'
import { getMenuCatalog, getMenuDetails } from '../../components/api/api'
import BackButton from '../../components/BackButton'
import styles from '../../css/menucatalog.module.css'
import { Audio } from 'react-loader-spinner'
import MenuComponent from '../../components/MenuComponent'
import { IoIosCreate } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'


const MenuCatalog = () => {
  const [recipes, setRecipes] = useState([])
  const [menuDetails, setMenuDetails] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(1)
  const navigate = useNavigate();
  const handleSelect = (value) => {
    setSelectedMenu(value)
  }
  useEffect(() => {
    (async () => {
      try {
        const catalog = await getMenuCatalog({
          menu_id: selectedMenu
        });
        if (catalog.data) {
          setRecipes(catalog.data)
        }

      } catch (err) {
        console.log(err)
        alert(err.response.data.message)
        if(err.response.data.message==="Unauthorized." || err.response.data.message==="Unauthenticated.")
                navigate("/login")
      }
    })()
  }, [selectedMenu])

  useEffect(() => {
    getMenuDetails().then((resp) => {
      if (resp.data) {
        setMenuDetails(resp.data.menus)
      }
    }).catch((err) => {
      console.log(err)
      alert(err.response.data.message)
      if(err.response.data.message==="Unauthorized." || err.response.data.message==="Unauthenticated.")
                navigate("/login")
    })
  },[])

  return (
    <div className={styles.mainContainer}>
      {
        recipes?.products ?
          <div>
            <div className={styles.header}>
              <div className='BackButtonContainer' >
                <BackButton path={"/admin"} />
              </div>
              <div className={styles.selectContainer}>
                <select
                  onChange={(e) => handleSelect(e.target.value)}
                  value={selectedMenu}
                  className={styles.select}
                >
                  {
                    menuDetails.map(menu =>
                      <option value={menu.id} key={menu.id}>{menu.nome}</option>)
                  }
                </select>
              </div>

              <button className="optionButton"
                disabled={!recipes}
                onClick={() => {
                  navigate("/admin/catalog/menuCatalog/addMenuRecipe", {
                    state: {
                      menu: menuDetails.find(el => el.id === selectedMenu),
                      recipes:recipes
                    }
                  })
                }}
                style={{ right: 0, position: 'absolute' }}
              >
                <IoIosCreate size={22} />
              </button>
            </div>
            <div className={styles.content}>
              <MenuComponent editable={true} recipes={recipes} />
            </div>

          </div>

          :
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{width:"100vw",height:"100vh",display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Audio color="black" />
            </div>

          </div>

      }

    </div>
  )
}

export default MenuCatalog