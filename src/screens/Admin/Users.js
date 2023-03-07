import React, { useEffect, useState, useRef, useContext } from 'react'
import { deleteUser, getUsersInfo, logout, updateUser } from '../../components/api/api';
import styles from "../../css/users.module.css"
import { Audio } from 'react-loader-spinner';
import Table from '../../components/Table';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Users = () => {

    const [filteredArray, setFilteredArray] = useState();
    const users = useRef([]);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext)
    const [filterValue, setFilterValue] = useState('');

    const handleModifyRow = (item) => {
        updateUser({
            id: item.iduser,
            username: item.username
        }).then(resp => {
            if (resp.data.state === 1) {
                const index = users.current.findIndex(el => el.iduser === item.iduser)
                users.current[index] = item
                setFilteredArray([...filter(filterValue)])
                if (user.info.id === item.iduser) {
                    let copy = { ...user }
                    copy.info.username = item.username
                    setUser({ ...copy })
                }


            }
        }).catch((err) =>{
            console.log(err)
            console.log(err.response.data.message)
        })
    }

    useEffect(() => {
        let isApiSubscribed = true;
        getUsersInfo().then(resp => {
            if (isApiSubscribed && users.current.length === 0) {
                users.current = resp.data;
                setFilteredArray(users.current)
            }

        }).catch((err) => {
            console.log(err)
            console.log(err.response.data.message);
            if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        });
        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };
    }, [])

    const handleRemoveItem = (item) => {
        const allow = window.confirm("Eliminare definitivamente l'elemento ? ")
        if (!allow)
            return
        const current = user.info.id === item.iduser;
        deleteUser({
            id: item.iduser
        }).then(resp => {
            if (resp.data.state === 1) {
                alert("Utente eliminato correttamente")
                if (current) {
                    logout();
                    navigate("/login")
                }
                else {
                    const copy = users.current.filter(el => el.iduser !== item.iduser)
                    users.current = [...copy];
                    setFilteredArray(filter(filterValue))

                }

            }
        }).catch(err => {
            console.log(err)
            console.log(err.response.data.message)
        })
    }


    const filter = (value) => {
        if (!value)
            return users.current;
        if (isNaN(value))
            return users.current.filter(el => el.username.toUpperCase().startsWith(value.toUpperCase()));
        else
            return users.current.filter(el => (`${el.iduser}`.startsWith(value) || `${el.badge}`.startsWith(value)));


    }

    const handleFilter = (value) => {
        setFilterValue(value)
        const arr = filter(value);
        setFilteredArray(arr);
    }

    return (
        <div className={styles.mainContainer}>
            <Header

            >
                <input className='_filterInput'
                    value={filterValue}
                    onChange={e => handleFilter(e.target.value)}
                    placeholder='Filtra'
                ></input>
                <Link className='button'
                    to='addUser'
                >
                    <FaPlus size={20} />
                </Link>
            </Header>
            <div className={styles.content}>
                {
                    !filteredArray ?
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                        :
                        <>
                            <Table
                                data={filteredArray}
                                headers={['ID', 'Username', 'Badge', "Admin", "Pending"]}
                                handleModifyRow={handleModifyRow}
                                handleRemoveItem={handleRemoveItem}
                                modalOptions={{
                                    modalLables: ['Username'],
                                    updatableKeys: ['username'],
                                    types: [{ type: 'text' }],
                                    title: 'Modifica Username'
                                }}
                            ></Table>
                        </>
                }
            </div>
        </div>
    )
}

export default Users