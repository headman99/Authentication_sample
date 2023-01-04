import React, { useEffect, useState, useCallback } from 'react'
import styles from "../../css/productcatalog.module.css"
import { getProductsCatalog, removeProduct, getProductGroups } from '../../components/api/api';
import Table from '../../components/Table';
import { Audio } from 'react-loader-spinner';
import BackButton from '../../components/BackButton';
import { BsSortUp } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { IoIosCreate } from 'react-icons/io';


const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredArray, setFilteredArray] = useState();
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const headers = ['id', 'nome', 'categoria', 'gruppo', 'descrizione']
  const [availableProductGroups, setAvailableProductGroups] = useState([])


  const goToAddProduct = () => {
    navigate("/admin/catalog/productCatalog/addProduct")
  }

  const filterContent = (filter) => {

    if (!filter) {
      setFilteredArray(products)
    } else {
      let arr = []
      if (!isNaN(parseInt(filter))) {
        arr = products.filter(elem => elem.id == parseInt(filter))
      } else {
        if (availableProductGroups.map(element => element.gruppo).includes(filter.toUpperCase())) {
          arr = products.filter(elem => elem.gruppo === filter.toUpperCase())
        } else {
          arr = products.filter(elem => (elem.nome.toUpperCase().includes(filter.toUpperCase()) || elem.category?.toUpperCase().includes(filter.toUpperCase())))
        }
      }
      if (JSON.stringify(arr) !== JSON.stringify(filteredArray)) {
        setFilteredArray(arr)
      }
    }
  }

  const handleRemoveItem = useCallback((data) => {
    const allow = window.confirm("Eliminare definitivamente l\'elemento ? ")
    if (allow) {
      removeProduct(data).then((resp) => {
        if (resp.data.state) {
          alert("Prodotto rimosso con successo");
        }
      }).catch((err) => {
        alert(err.response.data.message ? err.response.data.message : err);
        console.log(err);
      }).then(() => {
        window.location.reload();
      })
    }

  }, [])

  useEffect(() => {
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


    if (selected) {
      handleSort(selected)
    }
  }, [selected])

  useEffect(() => {
    if (availableProductGroups.length === 0) {
      getProductGroups().then(resp => {
        if (resp.data) {
          setAvailableProductGroups(resp.data)
        }
      }).catch(e => {
        console.log(e)
        console.log(e.response.data.message)
        if(e.response.data.message==="Unauthorized." || e.response.data.message==="Unauthenticated."){
            alert("effettua il login")
            navigate("/login")
        }
      })
    }
    if (products.length === 0) {
      getProductsCatalog().then(resp => {
        setProducts(resp.data);
        setFilteredArray(resp.data)
      }).catch((e) => {
        console.log(e);
        console.log(e.response.data.message)
        if(e.response.data.message==="Unauthorized." || e.response.data.message==="Unauthenticated."){
            alert("effettua il login")
            navigate("/login")
        }
      })
    }
  })


  return (
    <div className={styles.mainContainer} >
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
          onClick={goToAddProduct}
          disabled={!products}
        >
          <IoIosCreate size={22} />
        </button>
      </div>
      <div className={styles.contentContainer}>
        <div>
          {
            products.length === 0
              ?
              <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      </div>
    </div>
  )
}

export default ProductCatalog