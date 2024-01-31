import React, { useState, useEffect } from "react";
import { Api, Order, OrderStatus } from '../service/api'
import OrderInfo from '../components/OrderInfo'

const Orders = ({api}: {api: Api}) => {
    const [orders, setOrders] = useState<Array<Order>>([])

    useEffect(() => {
        api.getOrders().then(o => setOrders(o))
    }, [])

    return (
        <>
        <h1>Мои заказы</h1>

        <div className="orders">
        {
            (() => {
                if (orders.length) {
                    return orders.map((order, i) => {
                        const changeStatus = (status: OrderStatus) => api.changeOrderStatus(order.id, status).catch(() => alert('Ошибка при смене статуса'))

                        return (
                            <OrderInfo order={order} changeStatus={changeStatus} key={i} />
                        )
                    })
                }

                return (
                    <h3>Заказов</h3>
                )
            })()
        }
        </div>
        </>
    )
}

export default Orders
