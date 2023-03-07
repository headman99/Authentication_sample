import React from 'react'
import styles from '../css/ticket.module.css'
import { confirmAlert } from 'react-confirm-alert'
import "react-confirm-alert/src/react-confirm-alert.css"
import { useLocation, useNavigate } from 'react-router-dom'
import useLongPress from '../hooks/useLongPress'
const Ticket = ({ data, shadow, labels }) => {
  const { innerWidth, innerHeight } = window
  const navigate = useNavigate()
  const { pathname } = useLocation()


  function handleOnClick() {
    navigate(`${pathname}/${data.code}`)
  }

  function handleLongPress() {
    openModal(data)
  }

  const {handlers } = useLongPress({
    onClick: handleOnClick,
    onLongPress: handleLongPress
  });
  
  const openModal = (data) => {
    /*confirmAlert({
      title: `${details.client} - ${details.code}`,
      message: message,
      buttons:[]
    })*/
    confirmAlert({
      customUI: ({ e }) => {
        return (
          <div className={styles.modalUi}>
            <div className={styles.modalContainer}
              style={{ minHeight: innerHeight * 60 / 100, width: innerWidth * 40 / 100, wordBreak: 'break-all' }}
            >
              <div className={styles.modalContent}>
                {
                  Object.values(data).map((value, index) => {
                    return (
                      <div key={index}>
                        <span style={{ fontWeight: 'bold', overflow: 'hidden' }}>{`${labels[index]}: `}</span>
                        {
                          `${value}`
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        )
      }
    })
  }

  return (
    <div className={styles.mainContainer}
      style={shadow && { boxShadow: 'rgb(66 66 66 / 35%) 0px 5px 13px' }}
    >
      <div className={styles.content}
        {...handlers}
      >
        <table className={styles.table}>
          <tbody>
            <tr >
              <td style={{color:'red',fontSize:25}}>{data.client}</td>
              <td style={{color:'red',fontSize:25}}>{data.code}</td>
            </tr>
            <tr>
              <td>Creato: {data.created_at}</td>
              <td>Data evento: {data.event_date}</td>
            </tr>
            <tr>
              <td>Menu: {data.menu_id}</td>
              <td>Invitati: {data.quantity}</td>
            </tr>
            <tr>
              <td style={{borderBottomWidth:0}} colSpan={2}>Richieste: {data?.richiesta.slice(0,30)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  )
}

export default React.memo(Ticket)