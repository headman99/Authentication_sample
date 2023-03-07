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
                newValue: value
            })
        }

    }

    console.log(type.values)

    return (
        <div className={styles.main}>
            <label className={styles.label}>
                {label} :
            </label>
            {
                type.type === 'number' || type.type === 'text' ?
                    <input type={type.type}
                        className={styles.input}
                        value={value ? value : ''}
                        placeholder={placeholder}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => handleEnter(e)}
                        onBlur={(e) => handleBlur(e)}
                    ></input>
                    :
                    <select className={styles.input}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => handleEnter(e)}
                        onBlur={(e) => handleBlur(e)}
                        value={value?value:''}
                    >
                        <option value={value}>
                            {`${value?value:''}`}
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

        </div>

    )
}

export default React.memo(MyInput)