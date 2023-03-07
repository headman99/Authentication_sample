import React from 'react'
import Header from '../../components/Header'
import styles from '../../css/handleteams.module.css'
import Table from '../../components/Table'
import { useEffect } from 'react'
import { addTeam, getTeams, removeTeam, updateTeam } from '../../components/api/api'
import { useState } from 'react'
import { useCallback } from 'react'
import { Audio } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from "react-icons/ai"
import { confirmAlert } from 'react-confirm-alert'
import ModalForm from '../../components/ModalForm'

const HandleTeams = () => {
    const [teams, setTeams] = useState()
    const navigate = useNavigate();


    console.log(teams)

    const handleClickRow = (resp) => {
        navigate(`/admin/magazzino/handleTeams/${resp.id}`, {
            state: resp
        })
    }

    const onConfirmRowEditing = (data) => {
        addTeam(data).then(resp => {
            if (resp.data.state === 1) {
                alert("Modifica avvenuta con successo")
                console.log(resp.data)
                /*setTeams(prev => [...prev,{
                    id:resp.data.teams.id,
                    ...data
                }])*/
            }

        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.message)
        })
    }

    const openModal = () => {
        confirmAlert({
            title: "Modifica riga",
            message: 'messaggio',
            closeOnEscape: true,
            closeOnClickOutside: false,
            customUI: ({ onClose }) => {
                return (
                    <ModalForm
                        options={{
                            modalLables: ["Team"],
                            updatableKeys: ['name'],
                            types: [{ type: 'text' }]
                        }}
                        onConfirm={onConfirmRowEditing}
                        onCancel={onClose}
                        title="Crea team"
                    />
                )
            }

        })
    }

    useEffect(() => {
        let isApiSubscribed = true;
        getTeams().then(resp => {
            if (isApiSubscribed && resp.data)
                setTeams(resp.data)
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.message)
            if (e.response.data.message === "Unauthorized." || e.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        })

        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };

    }, [])

    const handleRemoveItem = useCallback((resp) => {
        const allow = window.confirm("Eliminare definitivamente l\'elemento ? ")
        if (!allow)
            return
        removeTeam(resp).then((resp) => {
            window.location.reload()
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.message)
        })
    }, [])

    const handleModifyRow = (data) => {
        updateTeam(data).then((resp) => {
            alert("Modifica avvenuta con successo")
            let copy = [...teams]
            const index = teams.findIndex(el => el.id === data.id)
            copy[index].name = data.name
            setTeams([...copy])
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.message)
        })
    }

    return (
        <div className={StyleSheet.mainContainer}>
            <Header title='Gestisci Teams'>
                <button className='button'><AiOutlinePlus size={30} onClick={() => openModal()} /></button>
            </Header>
            <div className={styles.content}>
                {
                    !teams ?
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                        :
                        <Table
                            data={teams}
                            headers={["ID", 'Team']}
                            handleRemoveItem={handleRemoveItem}
                            handleModifyRow={handleModifyRow}
                            modalOptions={{
                                modalLables: ["Team"],
                                updatableKeys: ['name'],
                                types: [{ type: 'text' }],
                                title: 'Modifica Nome Team'
                            }}
                            onCLickRow={handleClickRow}
                        />
                }

            </div>
        </div>
    )
}

export default HandleTeams