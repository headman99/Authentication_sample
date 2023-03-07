import React, { useState, useEffect } from 'react'
import styles from '../../css/addproduct.module.css'
import BackButton from '../../components/BackButton'
import { addMenuRecipe, getProductsCatalog } from '../../components/api/api'
import InputSelect from '../../components/InputSelect'
import { Audio } from 'react-loader-spinner'
import { useLocation } from 'react-router-dom'

const AddProductAlternative = () => {
    const [availableProducts, setAvailableProducts] = useState()
    const [resultArray, setResultArray] = useState([])
    const [selectProduct, setSelectedProduct] = useState();
    const [value,setValue] = useState('')
    const { state } = useLocation()

    const onChangeInputText = (item) => {
        setValue(item)
        const ingr = availableProducts.find(i => i.nome === item);
        setSelectedProduct(ingr)
    }


    useEffect(() => {
        let isApiSubscribed = true;
        getProductsCatalog().then((resp) => {
            if (isApiSubscribed && resp.data) {
                setAvailableProducts([...resp.data.data]);
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


    const handleAddProduct = () => {
        if (!selectProduct)
            return
        
        addMenuRecipe({
            product_id: selectProduct.id,
            menu_id: state.menu_id,
            gruppo: state.gruppo,
            sezione: state.sezione,
            alternative: state.product_id
        }).then((resp) => {
            alert("Prodotto aggiunto con successo")
            setResultArray(prev => [...prev, selectProduct])
        }).catch(err => {
            console.log(err)
            if(err.response.data.message)
                alert(err.response.data.message)
            else
                alert("Qualcosa è andato storto")
            console.log(err.response.data.message)
        });

    }


    return (
        <div className={styles.main} style={{overflowY:'hidden'}}>
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={-1} />
                </div>
                <div className={styles.title}>
                    <h1>Aggiungi Prodotto Alternativo</h1>
                </div>
            </div>

            {
                !availableProducts ?
                    <div className='AudioContainer'>
                        <Audio size={25} color={'black'} />
                    </div>
                    :
                    <>

                        <div className={styles.content}>
                            <div className={styles.filter}>

                                <div className={styles.inp}>
                                    <label className={styles.labell}>Prodotti</label>
                                    <InputSelect value={value} onChangeText={onChangeInputText} data={availableProducts.map(el => el.nome)} placeholder='Prodotto' />
                                </div>


                            </div>
                            <div className={styles.results} >
                                <div className={styles.table}>
                                    {resultArray.map(el => (
                                        <div key={el.nome} className={styles.row}>
                                            {
                                                Object.values(el).map((v, i) => <div key={i} className={styles.cell}>{v}</div>)
                                            }
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <button type='button' className='button' onClick={handleAddProduct}>
                                Crea
                            </button>
                        </div>
                    </>
            }




        </div>
    )
}

export default AddProductAlternative