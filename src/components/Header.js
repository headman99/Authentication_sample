import React from 'react'
import styles from "../css/header.module.css"
import BackButton from './BackButton'
const Header = ({ title, path, disableBackButton, children }) => {
    return (
        <div className={styles.mainContainer}>
            {
                !disableBackButton &&
                (<div className={styles.backButtonContainer}>
                    <BackButton path={path ? path : -1} />
                </div>)
            }
            <div className={styles.others}>
                {
                    title &&
                    <div className={styles.title}>
                        <h1>{title}</h1>
                    </div>
                }
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default React.memo(Header);