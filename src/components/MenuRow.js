import React from 'react'
import { FaTrashAlt, FaAngleRight, FaEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const MenuRow = ({ data, color, style, handleRemoveItem, handleModifyItem, disableIcons, editable, onEdit, disableArrow, goTo, children }) => {
    return (
        <div style={{ padding: 30 }}>
            <div
                style={{
                    ...style,
                    display: 'flex',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row'
                }}>
                    <div style={{
                        float: 'left',
                        color: 'black',
                        display: 'flex',
                        gap: 20,
                        visibility:!disableIcons?'visible':'hidden'
                    }}>
                        <FaTrashAlt className='trashIcon' size={35} onClick={handleRemoveItem} />
                        <FaEdit className='trashIcon' size={35} onClick={handleModifyItem} />
                    </div>
                </div>

                <div
                    contentEditable={editable}
                    suppressContentEditableWarning={true}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}

                    onBlur={(e) => {
                        if (e.target.innerText !== data)
                            onEdit(e.target.innerText)

                    }}
                    style={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    {children ? children : data}
                </div>
                <div className='trashIcon' onClick={goTo} style={{ visibility: (!disableIcons && !disableArrow) ? 'visible' : 'hidden' }}>
                    <FaAngleRight size={40} color={'black'} />
                </div>
            </div>

        </div>
    )
}

export default MenuRow