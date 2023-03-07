import React, { useEffect, useState } from 'react'
import { createMenu, getMenuCatalog, getMenuDetails, getProductsCatalog, updateMenuActive } from '../../components/api/api'
import BackButton from '../../components/BackButton'
import styles from '../../css/menucatalog.module.css'
import { Audio } from 'react-loader-spinner'
import MenuComponent from '../../components/MenuComponent'
import { IoIosCreate } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { useRef } from 'react'
import ModalForm from '../../components/ModalForm'
import { confirmAlert } from 'react-confirm-alert'
import Checkbox from '../../components/Checkbox'
import { useCallback } from 'react'


const MenuCatalog = () => {
  const { state } = useLocation();
  const [recipes, setRecipes] = useState()
  const menuDetails = useRef([])
  const [selectedMenu, setSelectedMenu] = useState(state?.menu_id ? state.menu_id : 1)
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isChecked, setIsChecked] = useState(true)

  const navigate = useNavigate();

  const handleSelect = (value) => {
    setSelectedMenu(value)
  }

  const hanldeSetActive = (e) => {
    const value = !isChecked;
    setIsChecked(value)
    updateMenuActive({
      menu_id: recipes.menu.id,
      active: value
    }).then(resp => {
      if (value)
        alert('menu attivato')
      else
        alert('menu disattivato')
    }).catch(err => {
      console.log(err)
      if (err.response.data?.message)
        alert(err.response.data.message)
    })
  }


  useEffect(() => {
    (async () => {
      try {
        const catalog = await getMenuCatalog({
          menu_id: selectedMenu
        });
        if (catalog.data) {
          setRecipes(catalog.data)
          const checked = menuDetails.current.find(m => m.id === parseInt(selectedMenu)).active
          setIsChecked(checked === 1 ? true : false)
        }

      } catch (err) {
        console.log(err)
        console.log(err.response.data?.message)
        if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
          alert("effettua il login")
          navigate("/login")
        }
      }
    })()
  }, [selectedMenu])

  useEffect(() => {

    let isApiSubscribed = true;
    getMenuDetails().then((resp) => {
      if (isApiSubscribed && resp.data) {
        menuDetails.current = resp.data.menus
      }
    }).catch((err) => {
      console.log(err)
      console.log(err.response.data.message)
      if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
        alert("effettua il login")
        navigate("/login")
      }
    }).then(() => {
      getProductsCatalog().then((resp) => {
        if (isApiSubscribed && resp.data.data) {
          setAvailableProducts([...resp.data.data])
        }
      }).catch((err) => {
        console.log(err)
        if (err.response?.data?.message)
          alert(err?.response?.data?.message)
      })
    });




    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [])

  const openModal = (data, modalOptions, onConfirmRowEditing) => {
    confirmAlert({
      title: "Modifica riga",
      message: 'messaggio',
      closeOnEscape: true,
      closeOnClickOutside: false,
      customUI: ({ onClose }) => {
        return (
          <ModalForm
            data={data}
            options={modalOptions}
            onConfirm={onConfirmRowEditing}
            onCancel={onClose}
            title={modalOptions.title ? modalOptions.title : 'Modifica Elemento'}
          />
        )
      }

    })
  }

  const handleEditCreateMenu = (item) => {
    createMenu({
      nome: item.title
    }).then(resp => {
      alert("Menu creato correttamente")
      window.location.reload();
    }).catch(err => {
      console.log(err)
      if (err.response.data.message)
        alert(err.response.data.message)
    })
  }

  const handleCreateMenu = () => {
    openModal({
      title: ''
    }, {
      modalLabels: ["Titolo"],
      updatableKeys: ['title'],
      types: [{ type: 'text' }],
      title: 'Scegli Titolo del menu'
    }, handleEditCreateMenu);
  }

  return (
    <div className={styles.mainContainer}>
      {
        recipes?.products ?
          <div>
            <div className={styles.header}>
              <div className={styles.backButtonContainer} >
                <BackButton path={"/admin"} />
              </div>
              <div style={{ position: 'relative', right: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <span style={{ fontSize: 20, paddingRight: 10 }}>Attiva</span>
                <input type='checkbox' checked={isChecked} style={{ height: 30, width: 30 }} onChange={(e) => hanldeSetActive(e)} />
              </div>
              <div className={styles.selectContainer}>
                <select
                  onChange={(e) => handleSelect(e.target.value)}
                  value={selectedMenu}
                  className={styles.select}
                >
                  {
                    menuDetails.current.map(menu =>
                      <option value={menu.id} key={menu.id}>{menu.nome}</option>)
                  }
                </select>
              </div>
              <div className={styles.buttonContainer}>
                <button className="button"
                  disabled={!recipes}
                  onClick={() => {
                    navigate("/admin/catalog/menuCatalog/addMenuRecipe", {
                      state: {
                        menu: menuDetails.current.find(el => el.id === selectedMenu),
                        recipes: recipes
                      }
                    })
                  }}

                >
                  <FaPlus size={22} />
                </button>

                <button className="button"
                  disabled={!recipes}
                  onClick={handleCreateMenu}
                >
                  <IoIosCreate size={25} />
                </button>
              </div>

            </div>
            <div className={styles.content}>
              <MenuComponent editable={true} recipes={recipes} setRecipes={setRecipes} availableProducts={availableProducts} />
            </div>

          </div>

          :
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ width: "100vw", height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Audio color="black" />
            </div>

          </div>

      }

    </div>
  )
}

export default MenuCatalog