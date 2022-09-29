import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import styles from '../css/backButton.module.css'
const BackButton = ({path,replace}) => {
    const navigate = useNavigate();
    return (
        <button
            className={styles.button}
            onClick={() => {
                navigate(path,{
                    replace:replace
                })
            }}>
            <FaArrowLeft size={30} />
        </button>
    )
}

export default BackButton