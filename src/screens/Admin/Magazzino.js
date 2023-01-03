import React, { useEffect, useState } from 'react'
import styles from '../../css/magazzino.module.css'
import { useNavigate } from 'react-router-dom'
import { getStock, removeIngredient, updateIngredientQuantity } from '../../components/api/api'
import { Audio } from 'react-loader-spinner'
import Table from '../../components/Table'
import { FaPlus } from 'react-icons/fa'
import { IoIosCreate } from 'react-icons/io'
import { BsSortUp } from 'react-icons/bs'
import BackButton from '../../components/BackButton'

const Magazzino = () => {
  const navigate = useNavigate();
  const [stock, setStock] = useState();
  const headers = ['Codice', 'Ingrediente', 'Quantità (g)', 'Descrizione', 'Fornitore', 'Ultima modifica']
  const [filteredArray, setFilteredArray] = useState();
  const [selected, setSelected] = useState(0);


  const goToUpdateQuantity = () => {
    navigate('/admin/magazzino/updateQuantity', {
      state: stock
    })
  }

  const modifyIngredientQuantity = (item) => {
    if (isNaN(parseInt(item.data))){
      alert("Il campo modificato deve essere un numero")
      return;
    }
      const data = {
        data: [{
          ingredient:item.id,
          quantity:parseInt(item.data)
        }]
      }
      console.log("data ",data);
    updateIngredientQuantity(data).then((resp) => {
      alert("Quantità modificata con successo")
    }).catch(err => {
      console.log(err);
      alert(err.response.data.message)
    }).then(()=>{
      window.location.reload();
    })
  }

  const filterContent = (filter) => {
    if (!filter) {
      setFilteredArray(stock)
    } else {
      if (!isNaN(parseInt(filter))) {
        const arr = stock.filter(elem => elem.ingredient_id == parseInt(filter))
        setFilteredArray(arr)
      } else {
        const arr = stock.filter(elem => (elem.name.includes(filter) || elem.category?.includes(filter)))
        if (JSON.stringify(arr) !== JSON.stringify(filteredArray)) {
          setFilteredArray(arr)
        }
      }
    }
  }

  useEffect(() => {
    if (!stock) {
      getStock().then(resp => {
        setStock(resp.data)
        setFilteredArray(resp.data)
      }).catch((err) => {
        console.log(err)
        alert(err)
        if(err.response.data.message==="Unauthorized." || err.response.data.message==="Unauthenticated.")
                navigate("/login")

      });
    }
  });


  useEffect(() => {
    if (selected) {
      handleSort(selected)
    }
  }, [selected])


  const handleRemoveItem = (ingredient) => {

    const value = window.confirm('Vuoi rimuoverer l\'ingrediente?')

    if (!value) {
      return;
    }
    removeIngredient(ingredient).then((resp) => {
      if (resp.data.state === 1) {
        window.location.reload();
        alert('Ingrediente rimosso con successo');
      }
    }).catch((err) => {
      alert(err)
    })
  }

  const handleSort = (mode) => {
    let arr = [...filteredArray]
    //Alfabetico
    if (mode === 0) {
      arr = arr.sort((el1, el2) => {
        if (el1.name.toUpperCase()  < el2.name.toUpperCase() ) return -1
        if (el1.name.toUpperCase()  > el2.name.toUpperCase() ) return 1;
        return 0;
      })
    }
    //Quantità crescente
    if (mode === 1) {
      arr = arr.sort((el1, el2) => el1.quantity - el2.quantity)
    }
    //Quantità decrescente
    if (mode === 2) {
      arr = arr.sort((el1, el2) => el2.quantity - el1.quantity)
    }
    //Ultima modifica
    if (mode === 3) {
      arr = arr.sort((el1, el2) => Date.parse(el2.updated_at) - Date.parse(el1.updated_at))
    }

    setFilteredArray(arr)
  }


  const goToAddIngredient = () => {
    navigate('/admin/magazzino/addIngredient');
  }

  return (
    <div className={styles.container}>
      <div className="_header">
        <BackButton path={"/admin"} />
        <div className="_filtersContainer">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <BsSortUp size={25} />
            <select className={styles.select} value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value={0}>
                Ingrediente
              </option>
              <option value={1}>
                Quantità Crescente
              </option>
              <option value={2}>
                Quantità Decrescente
              </option>
              <option value={3}>
                Ultima modifica
              </option>
            </select>
          </div>

          <input type='text'
            className="_filterInput"
            placeholder='Filtra'
            onChange={(text) => {
              filterContent(text.target.value);
            }}
          ></input>
        </div>
        <button className="button"
          onClick={goToAddIngredient}
          disabled={!stock}
        >
          <IoIosCreate size={22} />
        </button>

        <button className="button"
          onClick={goToUpdateQuantity}
          disabled={!stock}
        >
          <FaPlus size={22} />
        </button>
      </div>
      <div className={styles.contentContainer}>
        {
          !filteredArray
            ?
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%' }}>
              <Audio color='black' />
            </div>
            :
            <Table
              data={filteredArray}
              headers={headers}
              handleRemoveItem={handleRemoveItem}
              editable={[{
                index: 2,
                handler: modifyIngredientQuantity,
              }]}
            />
        }

      </div>

    </div>

  )
}

export default Magazzino