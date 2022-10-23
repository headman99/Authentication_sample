import React, { useEffect, useRef, useState } from 'react'
import { getOrdersList } from '../../components/api/api'
import styles from '../../css/ordiniricevuti.module.css'
import { Audio } from 'react-loader-spinner'
import BackButton from '../../components/BackButton'
import Table from '../../components/Table'
import TicketView from '../../components/TicketView'


const OrdiniRicevuti = () => {

    const [orders, setOrders] = useState();
    const headers = ['id', 'menu', "cliente", "quantità", "richiesta", "data creazione"]
    const range = useRef(50)
    const [filteredArray, setFilteredArray] = useState();
    const [date, setDate] = useState(null);

    const handleDateSelect = () => {

    }

    const rearrangedOrders = (Orders) => {
        let mock = [...Orders]
        let rearrangedOrders = []
        let codesList = new Set(mock.map(order => order.code))
        console.log(codesList)
        codesList.forEach((code) => {
            const temp = mock.filter(order => order.code === code)
            rearrangedOrders.push({
                details: {
                    client: temp[0].client,
                    created_at: temp[0].created_at,
                    code: temp[0].code
                },
                sections: temp.map(el => {
                    const { client, created_at, code, ...rest } = el
                    return ({
                        ...rest
                    })
                })
            })
        })
        return rearrangedOrders
    }

    useEffect(() => {
        getOrdersList({
            range: range.current
        }).then(resp => {
            if (resp.data) {
                setOrders(resp.data)
                setFilteredArray(resp.data)
                console.log(rearrangedOrders(resp.data))
            }
        }).catch(err => {
            console.log(err)
            alert(err.response.data.message)
        })
    }, [])

    const filterContent = (filter) => {
        if (!filter) {
            setFilteredArray(orders)
        } else {
            if (!isNaN(parseInt(filter))) {
                const arr = orders.filter(elem => (elem.menu_id == parseInt(filter) || elem.id == parseInt(filter)))
                setFilteredArray(arr)
            } else {
                const arr = orders.filter(elem => (elem.client.includes(filter)))
                if (JSON.stringify(arr) !== JSON.stringify(filteredArray)) {
                    setFilteredArray(arr)
                }
            }
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className="_header" style={{ minHeight: 100, }}>
                <div className='BackButtonContainer'>
                    <BackButton path="/admin" />
                </div>
                <div className="_filtersContainer">

                    <input type='text'
                        className="_filterInput"
                        placeholder='Filtra'
                        onChange={(text) => {
                            filterContent(text.target.value);
                        }}
                    ></input>


                </div>

            </div>
            <div className={styles.contentContainer}>
                {
                    filteredArray ?
                        <div>
                            <TicketView
                                data={filteredArray}
                                shadow={true}
                                labels={["Ordine #", "ID menu", "Codice", "Quantità", "Ricihieste"]}
                            />
                        </div>
                        :
                        <div className='AudioContainer'>
                            <Audio color='black' />
                        </div>
                }
            </div>
        </div>
    )
}

export default OrdiniRicevuti