import React, { useState } from 'react'
import { Order, OrderStatus } from '../service/api'
import OrderInfoItem from './OrderInfoItem'
import { match } from 'assert'

const statusTitle = (status: OrderStatus): string => {
    switch (status) {
        case 'new': return 'Новый';
        case 'process': return 'В обработке';
        case 'complete': return 'Завершен';
        case 'abort': return 'Отменен';
    }
}

const OrderInfo = ({order, changeStatus}: {order: Order, changeStatus: ((status: OrderStatus) => void) | null}) => {
    //const [showMore, setShowMore] = useState<boolean>(false)
    const [status, setStatus] = useState<OrderStatus>(order.status)

    let statusEl = null
    if (!!changeStatus) {
        statusEl = (
            <select className='order-info__status-select' value={status} onChange={(e) => {
                    const value = e.target.value as OrderStatus
                    changeStatus(value)
                    setStatus(value)
                }}
            >
                <option value="new">{statusTitle('new')}</option>
                <option value="process">{statusTitle('process')}</option>
                <option value="complete">{statusTitle('complete')}</option>
                <option value="abort">{statusTitle('abort')}</option>
            </select>
        )
    } else {
        statusEl = <span className={`order-info__status-value order-info__status-value--${status}`}>{statusTitle(status)}</span>
    }

    return (
        <div className='order-info'>
            <h3 className='order-info__title'>Заказ {order.id}</h3>
            <div className='order-info__customer'>Заказчик: { order.user ? `${order.user.lastName} ${order.user.firstName}` : 'Не указан' }</div>
            <div className='order-info__amount'>Сумма: <span className='order-info__amount-value'>{order.amount} руб.</span></div>
            <div className='order-info__status'>Статус: {statusEl}</div>
            <div className='order-info__comment'>Комментарий: { order.comment || <i>Нет комментария</i> }</div>
            <div className='order-info__date'>Дата: <span className='order-info__date-value'>{ order.timestamp.toLocaleString() }</span></div>
            <div className='order-info__items'>
            {/* <div style={{display: showMore ? 'none' : 'block' }}>
                <button onClick={ () => setShowMore(true) }>Показать подробности</button>
            </div>
            <div className='order-info__items' style={{display: showMore ? 'block' : 'none'}}>
                <button onClick={ () => setShowMore(false) }>Скрыть подробности</button> */}
                <table className='order-info__items-table'>
                    <tbody>
                        {
                            order.items.map((item, i) => {
                                return (
                                    <OrderInfoItem item={item} key={i} />
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderInfo
