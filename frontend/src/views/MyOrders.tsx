import React, { useEffect, useState } from 'react'
import { Api, Order } from '../service/api'
import OrderInfo from '../components/OrderInfo'

const MyOrders = ({api}: {api: Api}) => {
    const [orders, setOrders] = useState<Array<Order>>([])

    useEffect(() => {
        api.myOrders().then(o => setOrders(o))
    }, [])

    return (
        <>
            <h1>Мои заказы</h1>

            {
                (() => {
                    if (orders.length) {
                        return orders.map((order, i) => {
                            return (
                                <OrderInfo order={order} changeStatus={null} key={i} />
                            )
                        })
                    }

                    return (
                        <h3>У вас нет заказов</h3>
                    )
                })()
            }
        </>
    )
}

export default MyOrders
