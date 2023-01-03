import React from 'react'
import styles from '../css/incrementbutton.module.css'
import { BsArrowDownCircleFill } from 'react-icons/bs'
const IncrementButton = ({handleIncrementElements}) => {
    return (
        <div
            onClick={() => handleIncrementElements()}
            className={styles.IncreaseElementsButton}
            align='center'
        >
            <BsArrowDownCircleFill size={50} color='grey' />
        </div>
    )
}

export default IncrementButton