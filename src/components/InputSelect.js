import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/inputselect.module.css'

const InputSelect = ({ data, placeholder }) => {
    const [selected, setSelected] = useState('')
    //const [text, setText] = useState('')
    const inputRef = useRef();
    const [suggestions, setSuggestions] = useState([]);
    const [arrowDown, setArrowDown] = useState();

    const handleChangeText = (txt) => {
        inputRef.current.value = txt;
        if (txt) {
            setSuggestions(data.filter(item => (item.startsWith(txt))))
        } else {
            setSuggestions([]);
        }
    }

    useEffect(() => {
        inputRef.current.value = selected;
    }, [selected])

    return (
        <div className={styles.mainContainer}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                    placeholder={placeholder}
                    ref={inputRef}
                    className={styles.input}
                    onChange={(e) => {
                        handleChangeText(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            inputRef.current.blur();
                            setSuggestions([]);
                        }
                        if (e.key === 'ArrowDown') {
                            document.getElementById('suggestionsContainer').childNodes[0]?.focus();
                        }

                    }}
                    type='text'
                ></input>

                <div style={{ position: 'relative' }}>
                    <div id='suggestionsContainer' className={styles.suggestions} style={{ borderWidth: suggestions.length == 0 && 0 }}>
                        {
                            suggestions?.length > 0 &&
                            suggestions?.map(item => (
                                <div key={item}
                                    style={{ fontSize: 22,padding:12 }}
                                    tabIndex="0"
                                    className='suggestions'
                                    onClick={() => {
                                        inputRef.current.value = item
                                        setSuggestions([])
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            inputRef.current.value = item
                                            setSuggestions([])
                                        }
                                        if (e.key === 'ArrowDown') {
                                            e.target.nextSibling?.focus()
                                        }
                                        if (e.key === 'ArrowUp') {
                                            e.target.previousSibling?.focus();
                                        }
                                    }}
                                >
                                    {item}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div>
                <select value={selected} onChange={(e) => setSelected(e.target.value)} className={styles.select}>
                    <option value=''></option>
                    {data.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>

        </div>
    )
}

export default InputSelect