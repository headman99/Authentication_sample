import React, { useEffect, useState } from 'react'
import styles from '../../css/addproduct.module.css'
import { registerProduct, getProductGroups, getTeams, getStock, addProductRecipe } from '../../components/api/api';
import BackButton from '../../components/BackButton';
import { useRef } from 'react';
import { Audio } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import InputSelect from '../../components/InputSelect';


const AddProductRecipe = () => {

    const [availableIngredients, setAvailableIngredients] = useState()
    const [inputValue,setInputValue] = useState('')
    const [resultArray, setResultArray] = useState([])
    const [selectedIngredient, setSelectedIngredient] = useState();
    const { code } = useParams();

    
    useEffect(() => {
        let isApiSubscribed = true;
        getStock().then((resp) => {
            if (isApiSubscribed && resp.data) {
                setAvailableIngredients(resp.data.data.map(el => {
                    const { quantity, ...other } = el
                    return other
                }));
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

    const onChangeInputText = (item) =>{
        setInputValue(item)
        const ingr = availableIngredients.find( i => i.name === item);
        setSelectedIngredient(ingr)
    }


    const handleAddIngredient = () => {

        if(!selectedIngredient)
            return
            
        addProductRecipe({
            product_id: code,
            ingredient_id: selectedIngredient.id
        }).then((resp) => {
            alert("ingrediente aggiunto con successo")
            setResultArray(prev => [...prev, selectedIngredient])
        }).catch(err => {
            console.log(err)
            alert("Qualcosa è andato storto")
            console.log(err.response.data.message)
        })
        console.log(availableIngredients)
    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={-1} />
                </div>
                <div className={styles.title}>
                    <h1>Aggiungi Ingrediente</h1>
                </div>
            </div>
            <div className={styles.content}>
                {
                    !availableIngredients ?
                        <div className='audioContainer'>
                            <Audio size={25} color={'black'} />
                        </div>
                        :
                        <>
                            <div className={styles.filter}>

                                <div className={styles.inp}>
                                    <label className={styles.labell}>Ingredienti</label>
                                    {
                                        /*<select value={selectedIngredient} onChange={(e) => setSelectedIngredient(e.target.value)} className={styles.select}>
                                            <option value={''}> </option>
                                            {
                                                availableIngredients?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)
                                            }
                                        </select>*/
                                    }
                                    <InputSelect onChangeText={onChangeInputText} value={inputValue} data={availableIngredients.map(el => el.name)} placeholder='Ingrediente' />
                                </div>


                            </div>
                            <div className={styles.results} >
                                <div className={styles.table}>
                                    {resultArray.map(el => (
                                        <div key={el.name} className={styles.row}>
                                            {
                                                Object.values(el).map((v, i) => <div key={i} className={styles.cell}>{v}</div>)
                                            }
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </>
                }
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button type='button' className='button' onClick={handleAddIngredient}>
                    Crea
                </button>
            </div>


        </div>
    )
}

export default AddProductRecipe