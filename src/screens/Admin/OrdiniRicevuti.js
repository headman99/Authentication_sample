import React, { useEffect, useRef, useState } from 'react'
import {getOrdersList } from '../../components/api/api'
import styles from '../../css/ordiniricevuti.module.css'
import { Audio } from 'react-loader-spinner'
import TicketView from '../../components/TicketView'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import IncrementButton from '../../components/IncrementButton'


const OrdiniRicevuti = () => {
    const navigate = useNavigate()
    const orders = useRef([]);
    const range = 3
    const [filteredArray, setFilteredArray] = useState();
    const startDate = useRef('')
    const endDate = useRef('')
    const filterValue = useRef('')
    const labels = ["Cliente","Codice","Effettuato","Data evento","Menu ID","Numero ordine", "Richieste aggiuntive"]
    /*const fromITtoENdate = (date) => {
        const arrDate = date.split(' ')[0].split('/')
        const modifiedDate = arrDate[1] + '-' + arrDate[0] + '-' + arrDate[2]
        return modifiedDate
    }*/

    const filterbyDate = () => {
        fetchData({
            start_date:startDate.current?startDate.current:null,
            end_date:endDate.current?endDate.current:null
        }).then( resp =>{
            orders.current = resp
            filter()
        });
    }

    const filterByText = (filter, array) => {
        if (!filter)
            return array
        return array.filter(elem => (elem.client.toUpperCase().startsWith(filter.toUpperCase()) || elem.code.toUpperCase().startsWith(filter.toUpperCase())))
    }

    //Sistema l'array in modo tale che ogni card possiede un header di details dell'ordine e molteplici sezioni contenenti informazioni sui menù ordinati e le quantità.
    //Nota che in questo caso l'utilizzo i rearrangedOrders è pressochè inutile perche per ogni ordine viene associato una e una sola section contenente un menù solo
    //la presenza di questa funzione è per scopi di sviluppi futuri nel caso si voglia ottenere un comportamente come quello sopra descritto
    /*const rearrangedOrders = (Orders) => {
        if (Orders.length == 0)
            return []
        let mock = [...Orders]
        let rearrangedOrders = []
        Orders.forEach(order => {

        })
        return rearrangedOrders
    }*/

    const IncrementElements = () => {
        try {
            fetchData({
                start_from: orders.current.length,
                start_date: startDate.current?startDate.current:null,
                end_date : endDate.current?endDate.current:null
            }).then(resp => {
                orders.current = orders.current.concat(resp)
                filter()
            })
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }


    const fetchData = async (params) => {
        let orderList = (await getOrdersList({
            range: range,
            start_from: params?.start_from ? params?.start_from : null,
            start_date: params?.start_date?params?.start_date:null,
            end_date:params?.end_date?params?.end_date:null
        })).data
        return orderList
    }



    useEffect(() => {
        fetchData().then((resp) => {
            if (resp) {
                orders.current = resp
                setFilteredArray(resp)
            }
        }).catch(err =>{
            console.log(err)
            alert(err)
            console.log(err.response.data.message)
            if(err.response.data.message==="Unauthorized." || err.response.data.message==="Unauthenticated.")
                navigate("/login")
        })
    },[])

    //gestisce tutti le condizioni per i filtri
    const filter = () => {
        let arr = orders.current
        if (filterValue.current)
            arr = filterByText(filterValue.current, arr)
        //aggiorna il filteredArray solo se il nuovo array ottenuto dall'applicazione dei filtri contiene almeno un elemento diverso da filteredArray
        //if(rearrangedOrders(orders.current).length !== filteredArray.length)
        setFilteredArray(arr)
    }


    return (
        <div className={styles.mainContainer}>
            <div className="_header" style={{ minHeight: 100, }}>
                <div>
                    <button
                        className='button'
                        onClick={() => {
                            navigate("/admin", {
                                replace: true
                            })
                        }}>
                        <FaArrowLeft size={30} />
                    </button>
                </div>
                <div className="_filtersContainer">
                    <input type='text'
                        className="_filterInput"
                        placeholder='Filtra'
                        onChange={(e) => {
                            filterValue.current = e.target.value
                            filter()
                        }}
                    ></input>

                    <input
                        type='date'
                        onChange={(e) => {
                            startDate.current = e.target.value ? new Date(e.target.value) : ''
                            filterbyDate()
                        }}
                    ></input>

                    <input
                        type='date'
                        onChange={(e) => {
                            endDate.current = e.target.value ? new Date(e.target.value) : ''
                            filterbyDate()
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
                                labels={labels}
                            />
                            <IncrementButton handleIncrementElements={IncrementElements} />
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