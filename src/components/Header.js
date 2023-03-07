import React from 'react'
import styles from "../css/header.module.css"
import BackButton from './BackButton'
const Header = ({ title, path, disableBackButton, children }) => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.backButton}>
                {
                    !disableBackButton &&
                    (<div className={styles.backButton}>
                        <BackButton path={path ? path : -1} />
                    </div>)
                }
            </div>
            <div className={styles.titleContainer}>
                {
                    title &&<h1>{title}</h1>
                }
            </div>
            <div className={styles.others}>
                {children}
            </div>
        </div>
    )
}

export default React.memo(Header);