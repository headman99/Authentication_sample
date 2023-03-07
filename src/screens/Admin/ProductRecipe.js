import React from 'react'
import Table from '../../components/Table';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteIngredientProductRecipe, getTeamIngredientsByProductRecipe, updateProductRecipe } from '../../components/api/api';
import styles from '../../css/ingredientsproductlist.module.css'
import { Audio } from 'react-loader-spinner';
import Header from '../../components/Header'
import { FaPlus } from 'react-icons/fa'


const ProductRecipe = () => {
    const [filter, setFilter] = useState('')
    const location = useLocation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [filteredArray, setFilteredArray] = useState()
    const ingredients = useRef([]);


    useEffect(() => {
        let isApiSubscribed = true;
        getTeamIngredientsByProductRecipe({
            product_id: state.id
        }).then(resp => {
            if (isApiSubscribed && resp?.data) {
                ingredients.current = resp.data.data.map(item => ({
                    ...item,
                    quantity: parseFloat(item.quantity)
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

    const handleFilter = (value) => {
        console.log(value)
        setFilter(value)
        let content = filterContent(value)
        setFilteredArray([...content])
    }

    const filterContent = (value) => {
        if (!value || value ===''){
            return ingredients.current
        } 

        if (isNaN(value)){
            return ingredients.current.filter(item => item.name.toUpperCase().startsWith(value?.toUpperCase()))
        }
            
        return ingredients.current.filter(item => item.id === parseInt(value))
    }

    const handleRemoveItem = (item) => {
        const allow = window.confirm("Eliminare definitivamente l\'elemento ? ")
        if(!allow)
            return;
        deleteIngredientProductRecipe({
            product_id: state.id,
            ingredient_id: item.id
        }).then(resp => {
            if (resp.data?.state === 1) {
                alert("Ricetta aggiornata");
                ingredients.current = ingredients.current.filter(i => i.id !== item.id);
                const filtrato = filterContent(filter)
                setFilteredArray([...filtrato]);
            }
        }).catch(err => {
            console.log(err)
            console.log(err.response.data.message)
        })
    }

    const handleModifyRow = (item) => {
        updateProductRecipe({
            product_id: state.id,
            ingredient_id: item.id,
            quantity:parseFloat(item.quantity)
        }).then((resp) => {
            if(resp.data.state===1){
                alert("Ricetta aggiornata");
                console.log(ingredients.current)
                const index = ingredients.current.findIndex(el => el.id === item.id);
                ingredients.current[index] = {
                    ...item,
                    quantity:parseFloat(item.quantity)
                };
                const filtrato = filterContent(filter)
                setFilteredArray([...filtrato]);
            }
        })
    }

    return (
        <div className={styles.container}>
            <Header title={`${state.nome}`}>
                <input type='text'
                    className="_filterInput"
                    value={filter}
                    placeholder='Filtra'
                    onChange={(e) => handleFilter(e.target.value)}
                ></input>
                <button className='button' onClick = {()=>navigate(location.pathname+'/addRecipe')}>
                    <FaPlus size={25} />
                </button>
            </Header>
            <div className={styles.content}>
                {
                    !filteredArray ?
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                        :
                        <Table
                            data={filteredArray}
                            headers={['ID', 'Ingrediente', 'Quantità']}
                            handleRemoveItem={handleRemoveItem}
                            handleModifyRow={handleModifyRow}
                            modalOptions={{
                                modalLables: ['Quantità'],
                                updatableKeys: ['quantity'],
                                types: [{ type: 'number' }],
                                title: 'Modifica Ricetta Prodotto'
                            }}
                        />
                }
            </div>
        </div>
    )
}

export default ProductRecipe