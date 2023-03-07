import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addIngredientQuantity, getIngredientQuantityByOrder } from '../../components/api/api'
import styles from '../../css/calculator.module.css'
import Header from '../../components/Header'
import { Audio } from 'react-loader-spinner'
import Table from '../../components/Table'
import { AiFillPrinter } from 'react-icons/ai'
import { Mode } from '@mui/icons-material'
import { useCallback } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import ShoppingList from '../../components/ShoppingList'

const Calculator = () => {
    const navigate = useNavigate();
    const [ingredients, setingredients] = useState()
    const { code } = useParams()
    const [showPdf, setShowPdf] = useState(false)


    useEffect(() => {
        let isApisubscribed = true;
        getIngredientQuantityByOrder({
            order: code
        }).then(resp => {
            if (isApisubscribed)
                setingredients(resp.data)
        }).catch((err) => {
            console.log(err.response.data.message)
            if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        });
        return () => {
            isApisubscribed = false
        }

    }, [])

    const handleRemoveItem = (data) => {
        setingredients(previous => previous.filter(item => item.ingredient !== data.ingredient))
    }

    const handleModifyRow = (data) => {
        let copy = [...ingredients];
        const index = copy.findIndex(item => item.ingredient === data.ingredient);
        copy[index] = data;
        setingredients([...copy]);
    }

    const handlePrinter = () => {
        setShowPdf(prev => !prev)
    }

    const handleGoBack = () => {
        if (showPdf)
            setShowPdf(false)
        else{
            navigate("/admin/calculator")
            console.log('naviget')
        }
            
    };

    const handleConfirm = () => {
        const data = ingredients.map(i => ({
            ...i,
            mode: 2
        }));

        addIngredientQuantity({
            data: data
        }).then((resp) => {
            if (resp.data?.state === 1)
                alert("Magazzino aggiornato");
        }).catch((err) => {
            console.log(err.message)
            console.log(err)
        })
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <button className='button' onClick={handleGoBack}>
                    <FaArrowLeft size={30} />
                </button>
                <button className='button' onClick={handlePrinter}>
                    <AiFillPrinter size={25} />
                </button>

            </div>

            <div className={styles.content}>
                {
                    showPdf ? <ShoppingList data={ingredients} headers={['Ingrediente',"Quantità",'Categoria',"Fornitore"]}/> :
                        <>
                            {
                                !ingredients ?
                                    <div className='AudioContainer'>
                                        <Audio color='black' />
                                    </div>
                                    :
                                    <>
                                        <div style={{ overflowY: 'scroll', height: '75vh' }}>
                                            <Table
                                                data={ingredients}
                                                headers={['Ingrediente',"Quantità",'Categoria',"Fornitore"]}
                                                handleRemoveItem={handleRemoveItem}
                                                handleModifyRow={handleModifyRow}
                                                modalOptions={{
                                                    modalLables: ['Quantità',"Fornitore"],
                                                    updatableKeys: ['quantity',"provider"],
                                                    types: [{ type: 'number' },{type:'text'}],
                                                    title: 'Modifica ingrediente'
                                                }}

                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button className='button' onClick={handleConfirm}>Conferma</button>
                                        </div>

                                    </>

                            }
                        </>
                }
            </div>
        </div>
    )
}

export default Calculator