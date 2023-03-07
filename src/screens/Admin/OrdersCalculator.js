import React from 'react'
import OrdersView from '../../components/OrdersView'

const OrdersCalculator = () => {
    return(
        <OrdersView closed={false} path='/admin/calculator'/>
    )
}

export default OrdersCalculator