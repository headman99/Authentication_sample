import React from 'react'
import { useState } from 'react'
import styles from '../css/myinput.module.css'

const MyInput = ({ type, initialValue, onEndEditing, placeholder, label }) => {
    const [value, setValue] = useState(initialValue)
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur()
        }
        return
    }

    const handleBlur = (e) => {
        if (e.target.value !== initialValue) {
            onEndEditing({
                key: placeholder,
                newValue: e.target.value
            })
        }

    }

    const handleCheckboxChange = () => {
        onEndEditing({
            key: placeholder,
            newValue: !value
        })
        setValue(prev => !prev);
    }


    return (
        <div className={styles.main}>
            <label className={styles.label}>
                {label} :
            </label>
            {
                (type.type === 'number' || type.type === 'text') &&
                <input type={type.type}
                    className={styles.input}
                    value={value ? value : ''}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => handleEnter(e)}
                    onBlur={(e) => handleBlur(e)}
                ></input>

            }
            {
                type.type === 'select' &&
                <select className={styles.input}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => handleEnter(e)}
                    onBlur={(e) => handleBlur(e)}
                    value={value ? value : ''}
                >
                    <option value={value}>
                        {`${value ? value : ''}`}
                    </option>
                    {

                        type?.values?.filter(item => item !== value).length > 0 &&

                        type.values.filter(item => item !== value).map((v, index) => (<option key={index} value={v}>{v}</option>))


                    }
                    {
                        value && <option value={''}>{''}</option>
                    }

                </select>
            }

            {
                type.type === 'check' &&
                <input type='checkbox' className='checkbox' style={{ width: 35, height: 35 }} checked={value} onChange={handleCheckboxChange}></input>
            }

        </div>

    )
}

export default React.memo(MyInput)