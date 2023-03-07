import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from '../../css/completereg.module.css'
const CompleteRegistration = () => {

    const {state} = useLocation()
    const [value,setValue] = useState('')

  return (
    <div className={styles.mainContainer}>
        <div className={styles.content}>
            <label>CODICE CONFERMA</label>
            <input className={styles.filterInput} placeholder='codice' maxLength={4} value={value} onChange={(e) => setValue(e.target.value)}></input>
            <button className='button'>CONFERMA</button>
        </div>
    </div>
  )
}

export default CompleteRegistration