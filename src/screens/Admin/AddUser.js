import React from 'react'
import { useState } from 'react'
import Header from '../../components/Header'
import styles from '../../css/adduser.module.css'
import Checkbox from '../../components/Checkbox'
import { registerAdmin, registerClient } from '../../components/api/api'

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [psw, setPsw] = useState('');
    const [resultArray, setResultArray] = useState([]);
    const [isChecked, setIsChecked] = useState(false)

    const handleAddUser = async() => {
        if (isChecked && !psw) {
            alert("Per registrare un admin devi definire una password");
            return
        }
        if(!username){
            alert("Username non puo essere vuoto")
            return
        }

            
        const data = {
            username:username,
            password:psw
        }

        try {
            let user;
            if(isChecked)
                user = await registerAdmin(data)
            else
                user = await registerClient(data)
            alert("utente registrato")
            setResultArray(prev => [...prev,user.data.user]);
        } catch (err) {
            console.log(err)
            console.log(err.response.data.message)
            alert("Username già presente oppure errore generico, riprovare più tardi");
        }
       
    }

    return (
        <div className={styles.mainContainer}>
            <Header
                title='Registra utenti'
            >

            </Header>
            <div className={styles.content}>
                <div className={styles.filter}>
                    <div className={styles.inp}>
                        <label className={styles.labell}>Username</label>
                        <input className={styles.text} type='text'
                            value={username}
                            maxLength={150}
                            placeholder='Username'
                            onChange={(text) => setUsername(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${username?.length ? username.length : 0}/150`}</span>
                        </div>
                    </div>

                    <div className={styles.inp}>
                        <label className={styles.labell}>Password</label>
                        <input className={styles.text} type='password'
                            value={psw}
                            placeholder='Password'
                            onChange={(text) => setPsw(text.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label className={styles.labell}>Admin</label>
                        <Checkbox size={30} isChecked={isChecked} onChange={() => setIsChecked(prev => !prev)} />
                    </div>

                </div>
                <div className={styles.results} >
                    <div className={styles.table}>
                        {resultArray.map(el => (
                            <div key={el.name} className={styles.row}>
                                {
                                    Object.values(el).map((v, i) => <div key={i} className={styles.cell}>{v}</div>)
                                }
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button type='button' className='button' onClick={handleAddUser}>
                    Crea
                </button>
            </div>
        </div>
    )
}

export default AddUser