import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/inputselect.module.css'

const InputSelect = ({ data, placeholder, disableSelect, value, onChangeText, disabled }) => {
    const [selected, setSelected] = useState('')
    //const [text, setText] = useState('')
    const inputRef = useRef();
    const [suggestions, setSuggestions] = useState([]);
    const suggestionsRef = useRef();


    //const [inputValue, setInputValue] = useState(value ? value : '');

    const handleChangeText = (txt) => {
   
        if (onChangeText)
            onChangeText(txt)
        if (txt) {
            setSuggestions(data.filter(item => (item.toUpperCase().startsWith(txt.toUpperCase()))))
        } else {
            setSuggestions([]);
        }
    }

    useEffect(() => {
        if (onChangeText)
            onChangeText(selected)
        setSuggestions([]);
    }, [selected])

    const handleCLickSuggestion = (item) => {
        if (onChangeText)
            onChangeText(item)
        setSuggestions([])
    }

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
                    value={value}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            inputRef.current.blur();
                            setSuggestions([]);
                        }
                        if (e.key === 'ArrowDown') {
                            //document.getElementById('suggestionsContainer').childNodes[0]?.focus();
                            suggestionsRef.current.childNodes[0]?.focus();
                        }

                    }}
                    onBlur={() => {
                        new Promise(resolve => setTimeout(resolve, 200)).then(() => {
                            if (!(document.activeElement.className === 'suggest'))
                                setSuggestions([])
                        })
                    }}
                    type='text'
                ></input>

                <div style={{ position: 'relative' }} >
                    <div id='suggestionsContainer' ref={suggestionsRef} className={styles.suggestions} style={{ borderWidth: suggestions.length == 0 && 0 }} >
                        {
                            suggestions?.length > 0 &&
                            suggestions?.map((item, index) => (
                                <div key={index}
                                    tabIndex="0"
                                    className='suggest'
                                    onClick={() => {
                                        handleCLickSuggestion(item)
                                    }}

                                    onBlur={() => new Promise(resolve => setTimeout(resolve, 200)).then(() => {
                                        if (!(document.activeElement.className === 'suggest' || document.activeElement === inputRef.current))
                                            setSuggestions([]);
                                    })}

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
                                    <div>{item} </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div>
                {
                    (!disableSelect && !disabled) &&
                    <select style={{ maxWidth: 300, overflow: 'hidden' }} value={selected} onChange={(e) => setSelected(e.target.value)} className={styles.select}>
                        <option value=''></option>
                        {data.map((item, index) => <option key={index} value={item}>{item.length > 30 ? (item.slice(0, 100) + '...') : item}</option>)}
                    </select>
                }
            </div>

        </div>
    )
}

export default React.memo(InputSelect)