import React from 'react';
import { CartManager, Item } from '../service/cart';
import { Product } from '../service/api'

interface CartArgs {
    cartManager: CartManager
    item: Item
    product: Product
}

const CartItem = ({cartManager, item, product}: CartArgs) => {
    // const plus = () => cartManager.setItem(item.productId, item.count + 1)
    // const minus = () => cartManager.setItem(item.productId, item.count - 1)
    const remove = () => cartManager.removeItem(item.productId)

    return (
        <tr className='cart-item'>
            <td className='cart-item__photo'><img src={product.photo ?? '/placeholder.jpg'} /></td>
            <td className='cart-item__title'>{ product.title }</td>
            <td className='cart-item__price'>{ product.price } руб.</td>
            <td className='cart-item__count'>
                {/* <button onClick={minus} disabled={item.count <= 1}>-</button> */}
                <input className="input" type="number" value={item.count} min="1" onChange={(e) => cartManager.setItem(item.productId, Math.max(parseInt(e.target.value) || 1, 1)) }/>
                {/* <button onClick={plus}>+</button> */}
            </td>
            <td className='cart-item__remove'>
                <button className="btn btn-danger" onClick={remove}>Удалить</button>
            </td>
        </tr>
    )
}

export default CartItem