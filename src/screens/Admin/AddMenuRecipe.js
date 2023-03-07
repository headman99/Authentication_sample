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
  const [ratio1, setRatio1] = useState(1);
  const [ratio2, setRatio2] = useState(1)



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
  }, [])

  const handleSetSection = useCallback((txt) => {
    setSection(txt)
  }, [])

  const handleSetProduct = useCallback((txt) => {
    setProduct(txt)
  }, [])

  const checkInput = () => {
    if (!(product && group)) {
      alert("I campi non devono essere vuoti")
      return false
    }

    if(!productListNames.current.find(el => el === product) || !menuGroupsList.current.find(m => m===group)){
      alert("Inserisci dei prodotti o gruppi gia esistenti")
      return false;
    }

    if ((ratio1 === 0 || ratio2 === 0)) {
      alert("Scegli un ratio diverso da 0")
      return false;
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
      menu_id: state.recipes.menu.id,
      ratio: parseFloat(ratio1 / ratio2)
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
          setRatio1(1)
          setRatio2(1)

        }
      }).catch((err) => {
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
                <BackButton path="/admin/catalog/menuCatalog" state={{
                  menu_id: state.recipes.menu.id
                }} />
              </div>
              <div className={styles.title}>
                <h1>Aggiungi Prodotto al Menù</h1>
              </div>
              <div className={styles.title} style={{ display: 'flex', alignItems: 'center' }}>
                <h1>{state.recipes.menu.nome}</h1>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.inputContainer}>
                <InputSelect onChangeText={handleSetProduct} value={product} placeholder="Prodotto" data={productListNames.current} />
              </div>
              <div className={styles.inputContainer}>
                <InputSelect onChangeText={handleSetGroup} value={group} data={menuGroupsList.current} placeholder="Gruppo" />
              </div>
              <div className={styles.inputContainer}>
                <InputSelect disabled={!menuGroupsList.current.includes(group)} value={section} onChangeText={handleSetSection} data={sections} placeholder="Sezione" />
                <span style={{ visibility: (section!=='' && sections.findIndex(el => el === section) === -1) ? 'visible' : 'hidden' }} >Stai per creare una nuova sezione</span>
              </div>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  value={state.recipes.menu.nome}
                  disabled={true}
                ></input>
              </div>
              <div className={styles.inputContainer} >
                <div style={{ display: 'inline-block' }}>
                  <input className={styles.input} style={{ width: 100, marginRight: 10 }} type='number'
                    value={ratio1}
                    onChange={(e) => setRatio1(e.target.value)}
                  ></input>
                  <span style={{ fontSize: 32, fontWeight: 'bold' }}>/</span>
                  <div>Prodotto</div>
                </div>

                <div style={{ display: 'inline-block', marginLeft: 10 }}>
                  <input className={styles.input} style={{ width: 100 }} type='number'
                    value={ratio2}
                    onChange={(e) => setRatio2(e.target.value)}
                  ></input>
                  <div>Persona</div>
                </div>


              </div>
            </div>
            <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <button className='button' style={{ fontSize: 20 }}
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