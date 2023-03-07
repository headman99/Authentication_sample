import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import MenuComponent from '../../components/MenuComponent'
import styles from "../../css/menupage.module.css"
import { Audio } from 'react-loader-spinner'
import { getMenuCatalog } from '../../components/api/api'
import { useContext } from 'react'
import { MenuAlternativesContext } from '../../Routes/ClientRoutes'

const MenuPage = ({ data }) => {
    const { id } = useParams()
    const [recipes, setRecipes] = useState()
    const { contextRecipe } = useContext(MenuAlternativesContext);


    const onSelect = (item) => {
        let copy = [...recipes.products]
        const index1 = recipes.products.findIndex(el => (el.nome === item.product_name && el.sezione === item.sezione && el.gruppo === item.gruppo))
        const index2 = recipes.products.findIndex(el => (el.nome === item.alternative && el.sezione === item.sezione && el.gruppo === item.gruppo))

        copy[index2] = recipes.products[index1]
        copy[index1] = recipes.products[index2]



        copy.forEach((el, index) => {
            if (el.sezione !== item.sezione || el.gruppo !== item.gruppo)
                return;

            if (el.nome === item.product_name) {
                copy[index].alternative = null;
                return;
            }

            if (el.alternative === item.alternative) {
                copy[index].alternative = item.product_name
                return;
            }
            if (el.nome === item.alternative) {
                copy[index].alternative = item.product_name
                return;
            }

        })
        /*setRecipes(prev => ({
            ...prev,
            products: [...copy]
        }));*/

        //Aggiorno il context
        const index = contextRecipe.current.findIndex(el => el.menu.id === recipes.menu.id);
        if (index === -1)
            contextRecipe.current = [...contextRecipe.current, {
                menu: { ...recipes.menu },
                products: [...copy]
            }]
        else
            contextRecipe.current[index].products = [...copy]
    }

    useEffect(() => {
        const data = contextRecipe.current.find(el => el.menu.id === parseInt(id))
        if (data) {
            console.log(data)
            setRecipes({...data});
            return
        }

        getMenuCatalog({
            menu_id: id
        }).then(resp => {
            if (resp.data) {
                setRecipes(resp.data)
            }
        }).catch(err => {
            console.log(err)
            alert(err.response.data.message)
        })

    }, [])
    return (

        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <BackButton path={"/client"} />
            </div>
            <div className={styles.content}>
                {
                    recipes ?
                        <MenuComponent recipes={recipes} disableIcons={true} editable={false} onSelect={onSelect} />
                        :
                        <div className="AudioContainer">
                            <Audio color='black' />
                        </div>
                }
            </div>
        </div>
    )
}

export default MenuPage