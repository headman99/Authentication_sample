import React from 'react'
import styles from "../css/header.module.css"
import BackButton from './BackButton'
const Header = ({ title, path, disableBackButton }) => {
    return (
        <div className={styles.mainContainer}>
            {
                !disableBackButton &&
                <div className={styles.backButtonContainer}>
                    <BackButton path={path} />
                </div>
            }

            <div className={styles.title}>
                <h1>{title}</h1>
            </div>
        </div>
    )
}

export default Header