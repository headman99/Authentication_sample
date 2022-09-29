import React, {  useState } from 'react'
import styles from '../css/table.module.css'
import { HiOutlineTrash } from 'react-icons/hi'
import { BsArrowDownRight } from 'react-icons/bs'
const Table = ({data, headers, editable, handleRemoveItem }) => {

    console.log('render')

    const [modalText, setModalText] = useState('');

    const [modalCoords, setModalCoords] = useState({
        left: 0,
        top: -300
    });



    return (
        <div style={{ width: '100%', height: '100%' }}
            onClick={() => {
                if (modalText) {
                    setModalCoords({
                        left: 0,
                        top: -300
                    })
                    setModalText('')
                }
            }}
        >
            <div className={styles.modal}
                onClick={() => {
                    setModalCoords({
                        left: 0,
                        top: -300
                    })
                    setModalText('')
                }}
                style={{
                    top: modalCoords.top,
                    left: modalCoords.left
                }}
            >
                <span>{modalText}</span>
            </div>

            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead style={{ fontSize: 25 }}>
                    <tr>
                        {headers.map((header, index) => {
                            return (
                                <th key={index}
                                    style={{ paddingLeft: index === 0 ? 30 : 0 }}
                                >
                                    {header}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        const backrow = index % 2 == 0 ? '#e8e8e8' : 'white'
                        return (
                            <tr
                                style={{ backgroundColor: backrow }}
                                key={item.id}
                            >
                                {
                                    Object.values(item).map((el, i) => {
                                        const allowEditing = editable ? editable.map(item => item.index).includes(i) : false
                                        const isOverflowing = `${el}`.length > 20
                                        return (
                                            <td
                                                height={80}
                                                onDoubleClick={(e) => {
                                                    if (isOverflowing) {
                                                        setModalCoords({
                                                            top: e.pageY,
                                                            left: e.pageX
                                                        })
                                                        setModalText(el)
                                                    }

                                                }} 
                                                style={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    cursor: allowEditing&& 'text',
                                                }} align='center' key={i}
                                            >

                                                <div
                                                    style={{ width: '90%',fontSize: 25,overflow:'hidden' }}
                                                    contentEditable={allowEditing}
                                                    suppressContentEditableWarning={true}
                                                    onKeyDown={(e) => {
                                                        console.log(e.key)
                                                        if (e.key == 'Enter') {
                                                            e.preventDefault();
                                                            e.currentTarget.blur();
                                                        }
                                                    }}

                                                    onBlur={(e) => {
                                                        if ( e.target.innerText !== el.toString()) {
                                                            const handleModify = editable.filter(elem => elem.index == i)[0].handler
                                                            handleModify({
                                                                id:item.id,
                                                                data:e.target.innerText
                                                            })

                                                        }
                                                    }}
                                                >
                                                    {
                                                        (i == 0 && handleRemoveItem) &&
                                                        <div style={{ paddingLeft: 10, display: 'inline-block', float: 'left', height: '100%' }}>
                                                            <HiOutlineTrash size={30}

                                                                onClick={() => handleRemoveItem({
                                                                    id: parseInt(item.id)
                                                                })}

                                                            />
                                                        </div>
                                                    }
                                                    {
                                                        isOverflowing ? (`${el}`.substring(0, 20) + '...') : el
                                                    }
                                                </div>
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </div>

    )
}

export default Table