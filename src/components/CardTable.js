import React from 'react'
import styles from '../css/cardtable.module.css'
import ProdBarcodeCard from './ProdBarcodeCard'
import IncrementButton from './IncrementButton'

const CardTable = ({ data, handleIncrements,refreshAction }) => {

  const labels = ["id","prodotto","ordine","Creato il","operatore"]

  return (
    <div className={styles.contentContainer}>
      {
        data.map((product,index) => (
          <ProdBarcodeCard product={product} key={index} labels ={labels} refreshAction={refreshAction}/>
        ))        
      }
          <IncrementButton handleIncrementElements={handleIncrements}/>
    </div>
  )
}

export default CardTable