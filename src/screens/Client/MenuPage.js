import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import MenuComponent from '../../components/MenuComponent'
import styles from "../../css/menupage.module.css"
import { Audio } from 'react-loader-spinner'
import { getMenuCatalog } from '../../components/api/api'
const MenuPage = ({data}) => {
    const { id } = useParams()
    const [recipes,setRecipes] = useState()
    useEffect(()=>{
        console.log('eseguo')
        getMenuCatalog({
            menu_id:id
        }).then(resp =>{
            if(resp.data){
                console.log(resp.data)
                setRecipes(resp.data)
            }
        }).catch(err =>{
            console.log(err)
            alert(err.response.data.message)
        })
    },[])
  return (

    <div className={styles.mainContainer}>
        <div className={styles.header}>
            <BackButton path={"/client"}/>
        </div>
        <div className={styles.content}>
            {
                recipes?
                    <MenuComponent recipes={recipes} disableIcons={true} editable={false}/>
                :
                    <div className="AudioContainer">
                        <Audio color='black'/>
                    </div>
            }
        </div>
    </div>
  )
}

export default MenuPage