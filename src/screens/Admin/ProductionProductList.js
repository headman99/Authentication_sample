import React,{useRef} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from "../../css/productionproductlist.module.css"
import Header from '../../components/Header'
import { useEffect, useState } from 'react'
import { checkProductList, getTeamProductListByOrder } from '../../components/api/api'
import { Audio } from 'react-loader-spinner'
import { MdDone } from "react-icons/md"
import { useCallback } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { FaAngleRight } from 'react-icons/fa'

const ProductionProductList = () => {
    const currentTeam = JSON.parse(secureLocalStorage.getItem('team'));
    const location = useLocation()
    const { code } = useParams();
    const [filter,setFilter] = useState('')
    const products = useRef([])
    const [filteredArray,setFilteredArray] = useState([])
    const navigate = useNavigate();
    
    const handleChangeCheckbox = (data) => {
        //Set the new vaue of the checkbox
        const index = products.current.findIndex(el => el.id===data.id)
        products.current[index] = data
        setFilteredArray([...filterContent(filter)])

        checkProductList({
            order: data.order,
            product_id: data.id,
            value: data.checked
        }).catch((err) => {
            console.log(err)
            console.log(err.response.data.message)
            if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        })
    }

    const handleFilter = useCallback((value)=>{
        setFilter(value)
        let content = filterContent(value)
        setFilteredArray([...content])
    },[])

    const filterContent = (value) =>{
        if(!value)
            return products.current
        if(isNaN(value))
            return products.current.filter(item => item.product.toUpperCase().startsWith(value.toUpperCase()))
        return products.current.filter(item => item.id === parseInt(value))
    }

    useEffect(() => {
        let isApiSubscribed = true;
        getTeamProductListByOrder({
            order: code,
            team_id:currentTeam?.id
        }).then(resp => {
            if (isApiSubscribed) {
                products.current = resp.data.data
                setFilteredArray([...resp.data.data])
               
            }
        }).catch(err => {
            console.log(err)
            console.log(err?.response?.data.message)
            if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        })

        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };
    }, [])

    return (
        <div className={styles.container} >
            {
                !filteredArray ?
                    <div className='AudioContainer'>
                        <Audio color='black' />
                    </div>
                    :
                    <div className={styles.content}>
                        <Header title={`Prodotti da Lavorare --- ${currentTeam.name}`}>
                            <input type='text'
                                className="_filterInput"
                                style={{marginRight:20}}
                                value={filter}
                                placeholder='Filtra'
                                onChange={(e) => handleFilter(e.target.value)}
                            ></input>
                        </Header>
                        <table >
                            <thead>
                                <tr>
                                    <th data-label="ID" style={{ textAlign: 'center',width:'16%' }}>ID</th>
                                    <th data-label="Prodotto" style={{ textAlign: 'left', width: '50%' }}>Prodotto</th>
                                    <th data-label="Quantità" style={{width:'16%'}} >Quantità</th>
                                    <th><MdDone size={25} /></th>
                                    <th style={{width:'1%'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredArray.map((p, _) => (
                                        <tr key={p.product} >
                                            <td>{p.id}</td>
                                            <td className={styles.prodotto}>{p.product}</td>
                                            <td >{p.quantity}</td>
                                            <td>
                                                <input type='checkbox' checked={p.checked} style={{ height: 25, width: 25 }}
                                                    onChange={() => handleChangeCheckbox({
                                                        ...p,
                                                        checked:!p.checked
                                                    })}>
                                                </input>
                                            </td>
                                            <td style={{width:'1%'}}
                                                onClick={() => navigate(`${location.pathname}/${p.id}`, {
                                                    state:p
                                                })}
                                            >
                                                <FaAngleRight size={30} />
                                            </td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
            }

        </div>
    )
}

export default ProductionProductList