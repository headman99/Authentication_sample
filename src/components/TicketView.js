import React, { useEffect } from 'react'
import styles from "../css/ticketview.module.css"
import Ticket from './Ticket'
const TicketView = ({ data, labels, shadow }) => {

    return (
        <div className={styles.mainContainer}>
            {
                data.map(order => {
                    return (
                        <Ticket
                            shadow={shadow}
                            key={order.id}
                            data={order} 
                            labels={labels}    
                        />
                    )
                })
            }
        </div>
    )
}

export default TicketView