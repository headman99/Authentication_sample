import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../../css/addproducttoteams.module.css'
import Header from '../../components/Header'
import { useEffect } from 'react'
import { getIngredientsTeam, getStock, updateIngredientsTeam } from '../../components/api/api'
import { useState } from 'react'
import { Audio } from 'react-loader-spinner'
import { MdDone } from "react-icons/md"
import { useRef } from 'react'

const AddIngredientToTeam = () => {
    const { id, name } = useLocation().state
    const navigate = useNavigate()
    const [ingredients, setIngredients] = useState();
    const oldSelectedIngredients = useRef([]);


    useEffect(() => {
        let isApiSubscribed = true;

        (async () => {
            try {
                const selectedIngredients = (await getIngredientsTeam({ team_id: id })).data
                oldSelectedIngredients.current = [...selectedIngredients];
                const selectedIngredientsIDs = selectedIngredients.map(el => el.id)
                const ingrs = (await getStock()).data.data
                console.log(ingrs)
                if (isApiSubscribed) {
                    setIngredients([...ingrs.map(el => {
                        if (selectedIngredientsIDs.includes(el.id))
                            return {
                                ...el,
                                check: true
                            }
                        return {
                            ...el,
                            check: false
                        }
                    })])
                }
            } catch (err) {
                console.log(err)
                console.log(err.response.data.message)
                if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                    alert("effettua il login")
                    navigate("/login")
                }
            }

        })();
       
        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };
    }, [])


    const handleConfirm = () => {
        //all the selcted Ingredients
        const selected = ingredients.filter(el => el.check === true).map(item => {
            const { check, ...fields } = item;
            return ({
                ...fields
            })
        })

        if (JSON.stringify(oldSelectedIngredients.current) === JSON.stringify(selected))
            return;

        
        
        updateIngredientsTeam({
            team_id: id,
            add_ingredients_id: selected.map(i => i.id).filter(e => !oldSelectedIngredients.current.map(i => i.id).includes(e)),
            remove_ingredients_id:oldSelectedIngredients.current.map(i => i.id).filter(e => !selected.map(i => i.id).includes(e))
        }).then(resp => {
            alert("modifica avvenuta")
            oldSelectedIngredients.current = selected
        }).catch((err) => {
            console.log(err)
            console.log(err.response.data.message)
        });
    }

    const handleChangeCheck = (item) => {
        let copy = [...ingredients]
        const index = ingredients.findIndex(el => el.id === item.id)
        copy[index] = {
            ...item,
            check: !item.check
        }
        setIngredients([...copy])
    }

    return (
        <div className={styles.mainContainer}>
            <Header title={name} />
            <div className={styles.content}>
                {
                    (!ingredients) ?
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                        :
                        <div className={styles.tableContainer}>
                            <div className={styles.table}
                                style={{ width: '40%' }}
                            >
                                <div className={styles.thead}>
                                    <div className={styles.row}>
                                        <div className={styles.product}>Ingredienti selezionati</div>
                                        <div style={{ flex: 1, textAlign: 'right' }}><MdDone size={25} /></div>
                                    </div>
                                </div>
                                <div className={styles.tbody}>
                                    {
                                        ingredients.filter(item => item.check === true).map(item => (
                                            <div key={item.id} className={styles.row}>
                                                <div className={styles.product}>{item.name.substring(0, 50)}</div>
                                                <div style={{ flex: 1, textAlign: 'right' }}>
                                                    <input checked={item.check} type='checkbox' style={{ height: 25, width: 25 }}
                                                        onChange={() => handleChangeCheck(item)}>
                                                    </input>
                                                </div>
                                            </div>
                                        ))

                                    }
                                </div>
                            </div>
                            <div className={styles.table}
                                style={{ width: '60%' }}
                            >
                                <div className={styles.thead}>
                                    <div className={styles.row}>
                                        <div className={styles.product}>Ingredienti Disponibili</div>
                                        <div className={styles.team}>Team</div>
                                        <div className={styles.check}><MdDone size={25} /></div>
                                    </div>
                                </div>
                                <div className={styles.tbody}>
                                    {
                                        ingredients.filter(item => item.check === false).map(item => (
                                            <div key={item.id} className={styles.row}>
                                                <div className={styles.product}>{item.name.length > 60 ? `${item.name.substring(0, 60)}...` : item.name}</div>
                                                <div className={styles.team}>{item?.team}</div>
                                                <div className={styles.check}>
                                                    <input checked={item.check} type='checkbox' style={{ height: 25, width: 25 }}
                                                        onChange={() => handleChangeCheck(item)}>
                                                    </input>
                                                </div>
                                            </div>
                                        ))

                                    }
                                </div>
                            </div>
                        </div>
                }
                <button  className='button' onClick={handleConfirm}>Conferma</button>
            </div>

        </div>
    )
}

export default AddIngredientToTeam