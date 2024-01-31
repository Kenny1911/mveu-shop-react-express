import React from 'react'
import { OrderItem } from '../service/api'

const OrderInfoItem = ({item}: {item: OrderItem}) => {
    return (
        <tr className='order-info-item'>
            <td className='order-info-item__photo'><img src={item.photo ?? '/placeholder.jpg'} /></td>
            <td className='order-info-item__title'>{ item.title }</td>
            <td className='order-info-item__price'>{ item.price } руб.</td>
            <td className='order-info-item__count'>{ item.count } шт.</td>
        </tr>
    )
}

export default OrderInfoItem
