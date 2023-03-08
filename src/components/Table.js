import React, { useEffect, useState } from 'react'
import styles from '../css/table.module.css'
import { BsArrowDownRight } from 'react-icons/bs'
import { BsArrowDownCircleFill } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'
import { BsGearFill } from "react-icons/bs"
import { RxPencil2 } from "react-icons/rx"
import { confirmAlert } from 'react-confirm-alert'
import ModalForm from './ModalForm'
import { FaAngleRight } from 'react-icons/fa'

const Table = ({ data, headers, editable, disbaleEdit, disableDeletable, handleRemoveItem, handleModifyRow, modalOptions, onCLickRow }) => {
    const [shownElements, setShownElements] = useState([])
    const [shownIndex, setShownIndex] = useState(20)
    const increment = 50;
    const [modalText, setModalText] = useState('');
    const { innerWidth } = window;
    const [modalCoords, setModalCoords] = useState({
        left: 0,
        top: -300
    });
    const handleIncrementElements = () => {
        const remainingElements = data.length - shownElements.length
        setShownIndex(previous => remainingElements >= increment ? previous + increment : previous + remainingElements)
    }

    const hanldeOnDoubleClick = (e, el) => {

        const cellWidth = innerWidth / headers.length
        const spacing = cellWidth + 20
        const position = {
            top: e.pageY,
            left: e.pageX >= innerWidth - cellWidth ? (e.pageX - spacing) : e.pageX
        }
        setModalCoords(position)
        setModalText(el)

    }

    const onConfirmRowEditing = (params) => {
        handleModifyRow(params)
    }

    useEffect(() => {
        if (!data)
            return
        const newData = data.slice(0, shownIndex - 1)
        if (JSON.stringify(shownElements) !== JSON.stringify(newData)) {
            setShownElements(newData)
        }


    }, [data, shownIndex])

    const openModal = (data, e) => {
        confirmAlert({
            title: "Modifica riga",
            message: 'messaggio',
            closeOnEscape: true,
            closeOnClickOutside: false,
            customUI: ({ onClose }) => {
                return (
                    <ModalForm
                        data={data}
                        options={modalOptions}
                        onConfirm={onConfirmRowEditing}
                        onCancel={onClose}
                        title={modalOptions.title ? modalOptions.title : 'Modifica Elemento'}
                    />
                )
            }

        });
    }

    return (
        <div className={styles.mainContainer}
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
            <div className={styles.content}>


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

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {headers?.map((header, index) => <th key={index}>{header}</th>)}
                            {
                                (!disableDeletable || !disbaleEdit) && <th> <BsGearFill size={24} /></th>
                            }
                            {
                                onCLickRow && <th></th>
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {shownElements.map((item, index) => {
                            return (
                                <tr
                                    key={item.id}
                                >
                                    {
                                        Object.values(item).map((el, i) => {
                                            const allowEditing = editable ? editable.map(item => item.index).includes(i) : false
                                            const isOverflowing = `${el}`.length > 60
                                            return (
                                                <td
                                                    key={i}
                                                    onDoubleClick={(e) => isOverflowing ? hanldeOnDoubleClick(e, el) : null}
                                                    style={{
                                                        cursor: allowEditing ? 'text' : isOverflowing && 'pointer'
                                                    }}
                                                >

                                                    <div
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
                                                            !isNaN(el) ? el : !el ? '' : isOverflowing ? (`${el}`.substring(0, 60) + '...') : el
                                                        }
                                                    </div>
                                                </td>
                                            )
                                        })
                                    }
                                    {
                                        (!disableDeletable || editable) &&
                                        <td className={styles.options}>
                                            {
                                                !disableDeletable &&
                                                <FaTrashAlt size={25}
                                                    onClick={() => handleRemoveItem(item)}

                                                />
                                            }

                                            {
                                                !disbaleEdit &&
                                                <RxPencil2 style={{ marginLeft: 15 }} size={25} onClick={(e) => openModal(item, e)} />
                                            }

                                        </td>
                                    }
                                    {
                                        onCLickRow &&
                                        <td style={{ textAlign: 'right', width: '5%' }}
                                            onClick={() => onCLickRow(item)}
                                        >
                                            <FaAngleRight size={30} />
                                        </td>

                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {
                    data.length >= shownIndex &&
                    <div
                        onClick={handleIncrementElements}
                        className={styles.IncreaseElementsButton}
                        height={40}
                        align='center'
                        colSpan={headers.length}>
                        <BsArrowDownCircleFill size={50} color='grey' />
                    </div>
                }
            </div>
        </div>

    )
}

export default React.memo(Table)