import Table from '../../components/Table';
import React from 'react'
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage';
import { getTeamIngredientsByProductRecipe } from '../../components/api/api';
import styles from '../../css/ingredientsproductlist.module.css'
import { Audio } from 'react-loader-spinner';
import Header from '../../components/Header'


const IngredientsProductList = () => {

    const [filter, setFilter] = useState('')
    const { state } = useLocation();
    const team = JSON.parse(secureLocalStorage.getItem("team"));
    const navigate = useNavigate();
    const [filteredArray, setFilteredArray] = useState()
    const ingredients = useRef([]);

   
    useEffect(() => {
        let isApiSubscribed = true;
        getTeamIngredientsByProductRecipe({
            product_id: state.id,
            team_id: team?.id
        }).then(resp => {
            if (isApiSubscribed && resp?.data) {
                ingredients.current = resp.data.data.map(item => ({
                    ...item,
                    quantity: parseFloat(item.quantity) * state.quantity
                }))
                setFilteredArray(ingredients.current)
            }
        }).catch(err => {
            console.log(err)
            console.log(err?.response?.data.message)
            if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        })

        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };
    }, [])

    const handleFilter = useCallback((value) => {
        setFilter(value)
        let content = filterContent(value)
        setFilteredArray([...content])
    }, [])

    const filterContent = (value) => {
        if (!value)
            return ingredients.current
        if (isNaN(value))
            return ingredients.current.filter(item => item.name.toUpperCase().startsWith(value.toUpperCase()))
        return ingredients.current.filter(item => item.id === parseInt(value))
    }

    return (
        <div className={styles.container}>
            <Header title={`${state.product}`}>
                <input type='text'
                    style={{ marginRight: 20 }}
                    className="_filterInput"
                    value={filter}
                    placeholder='Filtra'
                    onChange={(e) => handleFilter(e.target.value)}
                ></input>
            </Header>
            <div className={styles.content}>
                {
                    !filteredArray ?
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                        :
                        <Table
                            pzIndex={2}
                            data={filteredArray}
                            headers={['ID', 'Ingrediente', 'Quantità']}
                            disableDeletable={true}
                            disbaleEdit={true}
                        />
                }
            </div>
        </div>
    )
}

export default IngredientsProductList