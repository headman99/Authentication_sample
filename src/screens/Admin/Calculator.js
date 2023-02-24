import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIngredientQuantityByOrder } from '../../components/api/api'

const Calculator = () => {
    const navigate = useNavigate()

    useEffect(() => {
        getIngredientQuantityByOrder({
            order_id: 1
        }).then(resp => {
            console.log(resp.data)
        }).catch((err) => {
            console.log(err.response.data.message)
            if (err.response.data.message === "Unauthorized." || err.response.data.message === "Unauthenticated.") {
                alert("effettua il login")
                navigate("/login")
            }
        })

    }, [])

    return (
        <div>Calculator</div>
    )
}

export default Calculator