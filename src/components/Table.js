import React, { useEffect, useState } from 'react'
import styles from '../css/table.module.css'
import { BsArrowDownRight } from 'react-icons/bs'
import { BsArrowDownCircleFill } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'
const Table = ({ data, headers, editable, handleRemoveItem }) => {

    console.log('render')
    const [shownElements, setShownElements] = useState([])
    const [shownIndex, setShownIndex] = useState(20)
    const increment = 50;
    const [modalText, setModalText] = useState('');
    const {innerWidth} = window;
    const [modalCoords, setModalCoords] = useState({
        left: 0,
        top: -300
    });

    const handleIncrementElements = () =>{
        const remainingElements = data.length - shownElements.length
        setShownIndex(previous => remainingElements>=increment?previous+increment: previous+remainingElements)
    }

    useEffect(() => {
        const newData = data.slice(0, shownIndex - 1)
        if (JSON.stringify(shownElements) !== JSON.stringify(newData)) {
            setShownElements(newData)
        }
    }, [data, shownIndex])

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
                                    style={{ paddingLeft: (index === 0 && handleRemoveItem) ? 30 : 0 }}
                                >
                                    {header}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {shownElements.map((item, index) => {
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
                                                        const cellWidth = innerWidth/headers.length
                                                        const spacing = cellWidth + 20
                                                        const position = {
                                                            top: e.pageY,
                                                            left:e.pageX>=innerWidth-cellWidth?(e.pageX-spacing):e.pageX
                                                        }
                                                        setModalCoords(position)
                                                        setModalText(el)
                                                    }

                                                }}
                                                style={{
                                                    maxWidth: 200,
                                                    whiteSpace: 'nowrap',
                                                    cursor: allowEditing ? 'text' : isOverflowing && 'pointer'
                                                }} align='center' key={i}
                                            >

                                                <div
                                                    style={{ width: '90%', fontSize: 25, overflow: 'hidden' }}
                                                    contentEditable={allowEditing}
                                                    suppressContentEditableWarning={true}
                                                    onKeyDown={(e) => {
                                                        if (e.key == 'Enter') {
                                                            e.preventDefault();
                                                            e.currentTarget.blur();
                                                        }
                                                    }}

                                                    onBlur={(e) => {
                                                        if (e.target.innerText !== el.toString()) {
                                                            const handleModify = editable.filter(elem => elem.index == i)[0].handler
                                                            handleModify({
                                                                id: item.id,
                                                                data: e.target.innerText
                                                            })

                                                        }
                                                    }}
                                                >
                                                    {
                                                        (i == 0 && handleRemoveItem) &&
                                                        <div style={{ paddingLeft: 10, display: 'inline-block', float: 'left', height: '100%' }}>
                                                            <FaTrashAlt size={30}
                                                                className="trashIcon"
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
                    {
                        data.length>=shownIndex &&
                        <tr>
                            <td
                            onClick={handleIncrementElements}
                            className={styles.IncreaseElementsButton} 
                            height={100}
                            align='center'
                            colSpan={headers.length}>
                                <BsArrowDownCircleFill size={50} color='grey'/>
                            </td>
                        </tr>
                    }
                </tbody>

            </table>
        </div>

    )
}

export default Table