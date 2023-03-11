import React, { useEffect, useState, useCallback } from 'react'
import styles from "../../css/productcatalog.module.css"
import { getProductsCatalog, removeProduct, getProductGroups, updateProduct } from '../../components/api/api';
import Table from '../../components/Table';
import { Audio } from 'react-loader-spinner';
import BackButton from '../../components/BackButton';
import { BsSortUp } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { IoIosCreate } from 'react-icons/io';
import { useRef } from 'react';
import { PanoramaSharp } from '@mui/icons-material';



const ProductCatalog = () => {
  const products = useRef([]);
  const [filteredArray, setFilteredArray] = useState();
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const headers = ['Id', 'Nome', 'Categoria', 'Gruppo']
  const [availableProductGroups, setAvailableProductsGroup] = useState([])
  const [inputValue, setinputValue] = useState('');

  const filterContent = (filter) => {
    if (!filter) {
      setFilteredArray([...products.current])
    } else {
      let arr = []
      if (!isNaN(parseInt(filter))) {
        arr = products.current.filter(elem => elem.id == parseInt(filter))
      } else {
        if (availableProductGroups.map(element => element.gruppo).includes(filter.toUpperCase())) {
          arr = products.current.filter(elem => elem.gruppo === filter.toUpperCase())
        } else {
          arr = products.current.filter(elem => (elem.nome.toUpperCase().startsWith(filter.toUpperCase()) || elem.category?.toUpperCase().startsWith(filter.toUpperCase())))
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
          const index = products.current.findIndex(e => e.id === data.id);
          products.current.splice(index, 1);
          filterContent(inputValue);
        }
      }).catch((err) => {
        alert(err.response.data.message ? err.response.data.message : err);
        console.log(err);
      });
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
    let isApiSubscribed = true;
    if (availableProductGroups.length === 0) {
      getProductGroups().then(resp => {
        if (isApiSubscribed && resp.data) {
          setAvailableProductsGroup([...resp.data])
        }
      }).catch(e => {
        console.log(e)
        console.log(e.response.data.message)
        if (e.response.data.message === "Unauthorized." || e.response.data.message === "Unauthenticated.") {
          alert("effettua il login")
          navigate("/login")
        }
      })
    }


    getProductsCatalog().then(resp => {
      if (isApiSubscribed) {
        products.current = resp.data.data;
        setFilteredArray(resp.data.data)
      }

    }).catch((e) => {
      console.log(e);
      console.log(e.response.data.message)
      if (e.response.data.message === "Unauthorized." || e.response.data.message === "Unauthenticated.") {
        alert("effettua il login")
        navigate("/login")
      }
    })

    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };

  }, [])

  const handleModifyRow = (params) => {
    updateProduct(params).then((resp) => {
      alert("Modifica avvenuta con successo")
      const index = products.current.findIndex(el => el.id === params.id);
      products.current[index] = { ...params };
      filterContent(inputValue);
    }).catch((err) => {
      console.log(err)
      console.log(err.response.data?.message)
      if (err.response.data?.message === "Unauthorized." || err.response.data?.message === "Unauthenticated.") {
        alert("effettua il login")
        navigate("/login")
      }

    })
  }

  const handleOnClickRow = (item) => {
    navigate(`/admin/catalog/productCatalog/${item.id}`, {
      state: item
    });
  }


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
            className='_filterInput'
            placeholder='Filtra'
            value={inputValue}
            onChange={(text) => {
              setinputValue(text.target.value)
              filterContent(text.target.value);
            }}
          ></input>
        </div>
        <Link className='button'
          to='/admin/catalog/productCatalog/addProduct'
          disabled={!filteredArray}
        >
          <IoIosCreate size={22} />
        </Link>
      </div>
      <div className={styles.contentContainer}>
        <div>
          {
            !filteredArray
              ?
              <div className='AudioContainer'>
                <Audio color='black' />
              </div>
              :
              <Table
                data={filteredArray}
                headers={headers}
                handleRemoveItem={handleRemoveItem}
                handleModifyRow={handleModifyRow}
                modalOptions={{
                  modalLables: ['Nome', 'Categoria', 'Gruppo'],
                  updatableKeys: ['nome', 'categoria', 'gruppo'],
                  types: [{ type: 'text' }, { type: 'text' }, { type: 'select', values: [...availableProductGroups.map(el => el.gruppo)] }],
                  title: 'Modifica prodotto'
                }}
                onCLickRow={handleOnClickRow}
              />
          }
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog