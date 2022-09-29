import React, { useEffect, useState } from 'react'
import styles from "../../css/catalog.module.css"
import { getProductsCatalog, removeProduct } from '../../components/api/api';
import Table from '../../components/Table';
import { Audio } from 'react-loader-spinner';
import BackButton from '../../components/BackButton';
import { BsSortUp } from 'react-icons/bs'
const Catalog = () => {

  const [mode, setMode] = useState(1);
  const [products, setProducts] = useState();
  const [filteredArray, setFilteredArray] = useState();
  const [selected, setSelected] = useState(0);
  const headers = ['id', 'nome', 'categoria', 'gruppo', 'barcode', 'descrizione']
  const handleSort = (m) => {
    let arr = [...filteredArray]
    //Nome
    if (m == 0) {
      arr = arr.sort((el1, el2) => {
        if (el1.nome.toUpperCase() < el2.nome.toUpperCase()) return -1
        if (el1.nome.toUpperCase() > el2.nome.toUpperCase()) return 1;
        return 0;
      })
    }
    //Nome decrescente
    if (m == 1) {
      console.log("entro")
      arr = arr.sort((el1, el2) => {
        if (el1.nome.toUpperCase() > el2.nome.toUpperCase()) return -1
        if (el1.nome.toUpperCase() < el2.nome.toUpperCase()) return 1;
        return 0;
      })
      console.log(arr)
    }
    //ID
    if (m == 2) {
      arr = arr.sort((el1, el2) => el1.id - el2.id)
    }

    setFilteredArray(arr)
  }

  const filterContent = (filter) => {
    if (!filter) {
      setFilteredArray(products)
    } else {
      if (!isNaN(parseInt(filter))) {
        const arr = products.filter(elem => elem.id == parseInt(filter))
        setFilteredArray(arr)
      } else {

        const arr = products.filter(elem => (elem.nome.toUpperCase().startsWith(filter.toUpperCase()) || elem.category?.toUpperCase().startsWith(filter.toUpperCase())))
        if (JSON.stringify(arr) !== JSON.stringify(filteredArray)) {
          setFilteredArray(arr)
        }
      }
    }
  }

  const handleRemoveItem = (data) => {
    removeProduct(data).then((resp) => {
      if (resp.data.state) {
        alert("Prodotto rimosso con successo");
      }
    }).catch((err) => {
      alert(err.response.data.errore ? err.response.data.errore : err);
      console.log(err);
    }).then(() => {
      window.location.reload();
    })
  }

  useEffect(() => {
    if (selected) {
      handleSort(selected)
    }
  }, [selected])

  useEffect(() => {
    if (!products) {
      getProductsCatalog().then(resp => {
        setProducts(resp.data);
        setFilteredArray(resp.data)
      }).catch((e) => {
        console.log(e);
        alert(e);
      })
    }

  }, [])


  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerOption}>
        <BackButton path={"/admin"} />
        <div className={styles.filtersContainer}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <BsSortUp size={25} />
            <select className={styles.select} value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value={0}>
                Nome
              </option>
              <option value={1}>
                Nome decrescente
              </option>
              <option value={2}>
                ID
              </option>
            </select>
          </div>

          <input type='text'
            className={styles.filterInput}
            placeholder='Filtra'
            onChange={(text) => {
              filterContent(text.target.value);
            }}
          ></input>
        </div>
        <button className={styles.button}
          style={{ borderRightColor: 'white' }}
        >
         <text>Prodotti</text> 
        </button>
        <button className={styles.button}
          style={{ borderLeftColor: 'white' }}
        >
          <text>Menù</text>
        </button>
      </div>
      <div className={styles.contentContainer}>
        {
          mode == 1 &&
          <div>
            {
              !products
                ?
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Audio color='black' />
                </div>
                :
                <Table
                  data={filteredArray}
                  headers={headers}
                  handleRemoveItem={handleRemoveItem}
                />
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Catalog