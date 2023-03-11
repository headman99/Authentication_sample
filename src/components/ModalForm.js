import { PanoramaRounded } from '@mui/icons-material'
import React, { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { json } from 'react-router-dom'
import styles from '../css/modalform.module.css'
import MyInput from './MyInput'

const ModalForm = ({ data, title, onConfirm, onCancel, options }) => {
    const { modalLables, updatableKeys, types } = options
    const inputsValue = useRef({...data})

    const handleChangeInput = (newData) => {
        const { key, newValue } = newData;
        inputsValue.current[`${key}`] = newValue
    }

    const handleOnConfirm = (params) => {
        if (JSON.stringify(params) !== JSON.stringify(data)) {
            onConfirm(params)
        }
        onCancel()
    }


    return (
        <div className={styles.modalUi} >
            <span>{title}</span>
            {
                updatableKeys.map((key, index) =>
                    <MyInput
                        label={modalLables ? modalLables[index] : key}
                        placeholder={key}
                        initialValue={data?data[`${key}`]:''}
                        key={key}
                        type={types[index]}
                        onEndEditing={handleChangeInput}
                    />
                )
            }
            <div>
                <button style={{ float: 'left', backgroundColor: '#ea5a5a' }} className='button' onClick={onCancel}>Annulla</button>
                <button style={{ float: 'right' }} className='button' onClick={() => handleOnConfirm(inputsValue.current)}>Conferma</button>
            </div>

        </div>
    )
}

export default ModalForm