import React, { useEffect, useRef, useState } from 'react'
import styles from '../../css/magazzino.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { getStock, removeIngredient, updateIngredientQuantity, updateIngredient, getTeams } from '../../components/api/api'
import { Audio } from 'react-loader-spinner'
import Table from '../../components/Table'
import { FaPlus } from 'react-icons/fa'
import { IoIosCreate } from 'react-icons/io'
import { BsSortUp } from 'react-icons/bs'
import BackButton from '../../components/BackButton'
import { AiOutlineTeam } from 'react-icons/ai'

const Magazzino = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('')
  const stock = useRef([]);
  const headers = ['ID', 'Ingrediente', 'Quantità', 'Categoria', 'Fornitore', 'Team']
  const [filteredArray, setFilteredArray] = useState();
  const [selected, setSelected] = useState(0);
  const teams = useRef([]);


  console.log(stock)
  const goToUpdateQuantity = () => {
    navigate('/admin/magazzino/updateQuantity', {
      state: stock.current
    })
  }

  const modifyIngredientQuantity = (item) => {
    if (isNaN(parseFloat(item.data))) {
      alert("Il campo modificato deve essere un numero")
      return;
    }
    const data = {
      data: [{
        ingredient: item.id,
        quantity: parseFloat(item.data)
      }]
    }

    updateIngredientQuantity(data).then((resp) => {
      alert("Quantità modificata con successo")
    }).catch(err => {
      console.log(err);
      alert(err.response.data.message)
    }).then(() => {
      window.location.reload();
    })
  }

  const handleModifyRow = (data) => {
    //console.log(data)
    updateIngredient(data).then(resp => {
      console.log(resp.data.data)
      alert("modifica avvenuta con successo");
      const index = stock.current.findIndex(el => el.id === data.id);
      stock.current[index] = { ...data }
      filterContent(inputValue)
    }).catch(err => {
      console.log(err)
      if(err.response.data?.message)
        alert(err.response.data?.message)
    })
  }

  const filterContent = (filter) => {
    if (!filter || filter ==='') {
      setFilteredArray([...stock.current])
    } else {
      if (!isNaN(parseInt(filter))) {
        const arr = stock.current.filter(elem => elem.ingredient_id == parseInt(filter))
        setFilteredArray(arr)
      } else {
        const arr = stock.current.filter(elem => (elem.name.toUpperCase().includes(filter.toUpperCase()) || elem.category?.toUpperCase().includes(filter.toUpperCase()) || elem.provider?.toUpperCase().includes(filter.toUpperCase())))
        if (JSON.stringify(arr) !== JSON.stringify(filteredArray)) {
          setFilteredArray(arr)
        }
      }
    }
  }

  useEffect(() => {
    let isApiSubscribed = true;
    getTeams().then(resp => {
      if (isApiSubscribed)
        teams.current = [...resp.data]

    }).catch((err) => {
      console.log(err)
      console.log(err.response.data.message)
      if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
        alert("effettua il login")
        navigate("/login")
      }
    })

    if (stock.current.length === 0) {
      getStock().then(resp => {
        if (isApiSubscribed) {
          stock.current = resp.data.data
          setFilteredArray([...stock.current]);
        }

      }).catch((err) => {
        console.log(err)
        console.log(err.response.data.message)
        if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
          alert("effettua il login")
          navigate("/login")
        }

      });
    }
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  },[]);


  useEffect(() => {
    if (selected) {
      handleSort(selected)
    }
  }, [selected])


  const handleRemoveItem = (ingredient) => {

    const confirm = window.confirm('Vuoi rimuoverer l\'ingrediente?')

    if (!confirm) {
      return;
    }
    removeIngredient(ingredient).then((resp) => {
      if (resp.data.state === 1) {
        alert('Ingrediente rimosso con successo');
        const index = stock.current.findIndex(el => el.id === ingredient.id);
        stock.current.splice(index,1);
        filterContent(inputValue)
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
        if (el1.name.toUpperCase() < el2.name.toUpperCase()) return -1
        if (el1.name.toUpperCase() > el2.name.toUpperCase()) return 1;
        return 0;
      })
    }
    //Quantità crescente
    if (mode === '1') {
      arr = arr.sort((el1, el2) => el1.quantity - el2.quantity)
    }
    //Quantità decrescente
    if (mode === '2') {
      arr = arr.sort((el1, el2) => el2.quantity - el1.quantity)
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
            value={inputValue}
            onChange={(text) => {
              setInputValue(text.target.value)
              filterContent(text.target.value);
            }}
          ></input>
        </div>

        <Link className='button'
          to='/admin/magazzino/handleTeams'
        >
          <AiOutlineTeam size={30} />
        </Link>
        <button className="button"
          onClick={goToAddIngredient}
          disabled={!filteredArray}
        >
          <IoIosCreate size={22} />
        </button>

        <button className="button"
          onClick={goToUpdateQuantity}
          disabled={!filteredArray}
        >
          <FaPlus size={22} />
        </button>
      </div>
      <div className={styles.contentContainer}>
        {
          !filteredArray
            ?
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Audio color='black' />
            </div>
            :
            <Table
              pzIndex = {2}
              data={filteredArray}
              headers={headers}
              handleRemoveItem={handleRemoveItem}
              handleModifyRow={handleModifyRow}
              modalOptions={{
                modalLabels: ['Nome', 'Quantità', 'Categoria', 'Fornitore', "Team","pz"],
                updatableKeys: ['name', 'quantity', 'category', 'provider', "team",'pz'],
                types: [{ type: 'text' }, { type: 'number' }, { type: 'text' }, { type: 'text' }, { type: 'select', values: teams.current.map(t => t.name) } , { type: 'check'}],
                title: 'Modifica Ingrediente'
              }}

              /*editable={[{
                index: 2,
                handler: modifyIngredientQuantity,
              }]}*/
            />
        }

      </div>

    </div>

  )
}

export default Magazzino