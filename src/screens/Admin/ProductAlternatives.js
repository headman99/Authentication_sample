import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from '../../css/productalternatives.module.css'
import { getMenuRecipeAlternative, removeMenuRecipe } from '../../components/api/api'
import { Audio } from 'react-loader-spinner'
import Table from '../../components/Table'
import Header from '../../components/Header'
import { AiOutlinePlus } from 'react-icons/ai'

const ProductAlternatives = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState();
    const handleRemoveItem = (item) => {
        const allow = window.confirm("Eliminare definitivamente l\'elemento ? ");
        if (!allow)
            return

        removeMenuRecipe({
            product_id: item.id,
            menu_id: state.menu_id,
            gruppo: state.gruppo,
            sezione: state.sezione,
            alternative: state.product_id
        }).then(resp => {
            const removed = products.filter(el => el.id !== item.id);
            setProducts([...removed]);
        }).catch(err => {
            console.log(err)
            console.log(err.response.data.message)
        });
    }

    useEffect(() => {
        let isApiSubscribed = true;
        getMenuRecipeAlternative({
            alternative: state.product_id,
            menu_id: state.menu_id,
            gruppo: state.gruppo,
            sezione: state.sezione ? state.sezione : ''
        }).then(resp => {
            if (isApiSubscribed && resp?.data) {
                
                setProducts([...resp.data])
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




    return (
        <div className={styles.mainContainer}>
            <Header title='Lista scelte alternative'>
                <Link className='button' to='addAlternative' state={state}><AiOutlinePlus size={30} /></Link>
            </Header>
            <div className={styles.content}>
                {
                    !products ?
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                        :
                        <Table
                            data={products}
                            headers={['id', 'nome', 'categoria', 'gruppo']}
                            handleRemoveItem={handleRemoveItem}
                            disbaleEdit={true}
                        />


                }
            </div>
        </div>
    )
}

export default ProductAlternatives