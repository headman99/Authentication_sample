import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'

const MenuRow = ({ data, color, style, handleIconClick, disableIcons, editable, onEdit }) => {

    const handleCLick = () => {
        handleIconClick()
    }

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
                    marginRight: 20
                }}>

                    {
                        !disableIcons &&
                        <FaTrashAlt size={30}
                            className="trashIcon"
                            onClick={handleCLick}
                            style={{
                                position: 'absolute',
                                float: 'left',
                                color: 'black',
                            }} />
                    }
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
                        if (e.target.innerText !== data) {
                            onEdit(e.target.innerText)
                        }
                    }}
                    style={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    {data}
                </div>
            </div>
        </div>
    )
}

export default MenuRow