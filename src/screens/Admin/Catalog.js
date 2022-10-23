import React from 'react'
import styles from '../../css/catalog.module.css'
import BackButton from '../../components/BackButton'
import { useNavigate } from 'react-router-dom'
const Catalog = () => {
  const navigate = useNavigate()
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <div className='header' style={{ width: '100%' }}>
        <div className='BackButtonContainer'>
          <BackButton path='/admin' />
        </div>
      </div>

      <div className={styles.content}>
        <button className='PathButton'
          onClick={() => navigate("/admin/catalog/productCatalog")}
        >Prodotti</button>
        <button className='PathButton'
          onClick={() => navigate("/admin/catalog/menuCatalog")}
        >Menù</button>
      </div>
    </div>

  )
}

export default Catalog