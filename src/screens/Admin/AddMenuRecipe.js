import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import InputSelect from '../../components/InputSelect';
import styles from '../../css/addmenurecipe.module.css'
import { getProductsCatalog } from '../../components/api/api';
import BackButton from '../../components/BackButton';
import { Audio } from 'react-loader-spinner';
import { addMenuRecipe } from '../../components/api/api';

const AddMenuRecipe = () => {
  const { state } = useLocation();
  const [sections, setSections] = useState([])
  const menuGroupsList = useRef([...new Set(state.recipes.products.map(r => r.gruppo))])
  const sectionsList = useRef([...new Set(state.recipes.products.map(r => r.sezione))])
  const productListNames = useRef();
  const [productsList, setProductsList] = useState()
  const [product, setProduct] = useState('')
  const [group, setGroup] = useState('')
  const [section, setSection] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (menuGroupsList.current.includes(group)) {
      let newSections = [...new Set(state.recipes.products.filter(pr => pr.gruppo === group).map(p => p.sezione))]
      if (newSections.includes('')) {
        newSections.forEach(el => {
          if (el === '') {
            newSections[newSections.indexOf(el)] = 'vuoto'
          }
        })
      }

      setSections(newSections)
    } else {
      if (sections.length > 0) {
        setSections([])
      }
    }
  }, [group])

  const handleSetGroup = useCallback((txt) => {
    setGroup(txt)
  }, [group])

  const handleSetSection = useCallback((txt) => {
    setSection(txt)
  }, [section])

  const handleSetProduct = useCallback((txt) => {
    setProduct(txt)
  }, [product])

  const checkInput = () => {
    if (!(product && group && section)) {
      alert("I campi non devono essere vuoti")
      return false
    }
    return true
  }

  const handleAddMenuRecipe = () => {
    if (!checkInput()) {
      return
    }

    let allow = true;
    const data = {
      product_id: productsList.find(p => p.nome === product).id,
      gruppo: group,
      sezione: section,
      menu_id: state.menu.id
    }

    const sect = section !== 'vuoto' ? section : ''
    if (!sectionsList.current.includes(sect)) {
      allow = window.confirm("La sezione non esiste per il gruppo corrente, si intende procedere?");
    }

    if (allow) {
      addMenuRecipe(data).then((resp) => {
        if (resp.data?.state === 1) {
          alert("Prodotto inserito nel menù correttamente")
          setProduct('')
          setSection('')
          setGroup('')
          navigate(-1)
        }
      }).then((err) => {
        console.log(err)
        alert(err.response.data.message)
      })
    }

  }

  useEffect(() => {
    let isApiSubscribed = true;
    getProductsCatalog().then(resp => {
      if (isApiSubscribed) {
        productListNames.current = resp.data.data.map(p => p.nome)
        setProductsList(resp.data.data.map(p => {
          return ({
            id: p.id,
            nome: p.nome
          })
        }))
      }
      
    }).catch((err) => {
      console.log(err)
      alert(err.response.data.message)
    })
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };

  }, [])

  return (
    <div className={styles.mainContainer}>
      {
        productsList ?
          <div>
            <div className={styles.header}>
              <div className='BackButtonContainer'>
                <BackButton path="/admin/catalog/menuCatalog" />
              </div>
              <div className={styles.title}>
                <h1>Aggiungi Prodotto al Menù</h1>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.inputContainer}>
                <InputSelect onChangeText={handleSetProduct} placeholder="Prodotto" data={productListNames.current} />
              </div>
              <div className={styles.inputContainer}>
                <InputSelect onChangeText={handleSetGroup} data={menuGroupsList.current} placeholder="Gruppo" />
              </div>
              <div className={styles.inputContainer}>
                <InputSelect disabled={!menuGroupsList.current.includes(group)} onChangeText={handleSetSection} data={sections} placeholder="Sezione" />
              </div>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  value={state.menu?.nome}
                  disabled={true}
                ></input>
              </div>

            </div>
            <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <button className='button' style={{ fontSize: 25 }}
                onClick={handleAddMenuRecipe}
              >
                Aggiungi
              </button>
            </div>
          </div>
          :
          <div style={{ width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <Audio color='black' />
          </div>
      }



    </div>
  )
}

export default AddMenuRecipe