import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/inputselect.module.css'

const InputSelect = ({ data, placeholder, disableSelect, value, onChangeText, disabled }) => {
    const [selected, setSelected] = useState('')
    //const [text, setText] = useState('')
    const inputRef = useRef();
    const [suggestions, setSuggestions] = useState([]);

    const handleChangeText = (txt) => {
        inputRef.current.value = txt;
        if (onChangeText) {
            onChangeText(txt)
        }
        if (txt) {
            setSuggestions(data.filter(item => (item.toUpperCase().startsWith(txt.toUpperCase()))))
        } else {
            setSuggestions([]);
        }
    }

    useEffect(() => {
        inputRef.current.value = selected;
        if (onChangeText) {
            onChangeText(selected)
        }
    }, [selected])

    const handleCLickSuggestion = (item) => {
        inputRef.current.value = item
        if (onChangeText) {
            onChangeText(item)
        }
        setSuggestions([])
    }

    useEffect(() => {
        if (value) {
            inputRef.current.value = value;
        }
    }, [value])

    return (
        <div className={styles.mainContainer}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                    disabled={disabled ? disabled : false}
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
                            suggestions?.map((item, index) => (
                                <div key={index}
                                    tabIndex="0"
                                    className='suggestions'
                                    onClick={() => {
                                        handleCLickSuggestion(item)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCLickSuggestion(item)
                                        }
                                        if (e.key === 'ArrowDown') {
                                            e.target.nextSibling?.focus()
                                        }
                                        if (e.key === 'ArrowUp') {
                                            e.target.previousSibling?.focus();
                                        }
                                    }}
                                >
                                    <div >{item} </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div>
                {
                    (!disableSelect && !disabled) &&
                    <select style={{ maxWidth: 500 }} value={selected} onChange={(e) => setSelected(e.target.value)} className={styles.select}>
                        <option value=''></option>
                        {data.map((item, index) => <option key={index} value={item}>{item.length > 30 ? (item.slice(0, 100) + '...') : item}</option>)}
                    </select>
                }
            </div>

        </div>
    )
}

export default React.memo(InputSelect)