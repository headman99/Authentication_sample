import React, { useEffect } from 'react'
import styles from '../css/ticket.module.css'
const Ticket = ({ data, shadow, labels }) => {


  return (
    <div className={styles.mainContainer}
      style={shadow && { boxShadow: 'rgb(66 66 66 / 35%) 0px 5px 13px' }}
    >
      {
        Object.entries(data).map(([key, value], index) => {
          return (
            <div
              className={styles.content}
              style={index === 0 ? { fontSize: 30, fontWeight: 'bold' } : null}>
                {value}
            </div>
          )
        }
        )
      }
      <div className={styles.footer}>

      </div>
    </div>
  )
}

export default Ticket