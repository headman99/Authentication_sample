import React, { useEffect, useRef } from 'react'
import styles from '../css/ticket.module.css'
import { MdOutlineExpandMore } from "react-icons/md"
import { confirmAlert } from 'react-confirm-alert'
import "react-confirm-alert/src/react-confirm-alert.css"
import { useNavigate } from 'react-router-dom'
import useLongPress from '../hooks/useLongPress'
const Ticket = ({ data, shadow, labels }) => {
  const { innerWidth, innerHeight } = window
  const navigate = useNavigate()

  function handleOnClick() {
    navigate(`/admin/orders/${data.code}`)
  }

  function handleLongPress() {
    openModal(data)
  }

  const { action, handlers } = useLongPress({
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
        {
          Object.values(data).map((v, index) => {
            return (
              <div key={index}>
                {
                  index === 0 || index === 1 ?
                    <span style={{ fontWeight: 'bold', fontSize: 30, color: '#bf1515' }}>{`${v}`.slice(0, 20)}</span>
                    :
                    <>
                      <span style={{ fontWeight: 'bold', overflow: 'hidden' }}>{`${labels[index]}:`}</span><span>{`${v}`.slice(0, 15)}</span>
                    </>

                }

              </div>
            )
          })

        }

      </div>
    </div >
  )
}

export default React.memo(Ticket)