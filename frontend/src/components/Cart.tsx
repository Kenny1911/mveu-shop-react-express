import React from 'react';
import { CartManager } from '../service/cart';
import { Product } from '../service/api';
import CartItem from './CartItem'

interface CartArgs {
    cartManager: CartManager
    getProduct: (id: string) => Product
}

const Cart = ({cartManager, getProduct}: CartArgs) => {
    const items = cartManager.getItems();
    
    let amount = 0

    for (let item of items) {
        amount += getProduct(item.productId).price * item.count
    }

    if (items.length) {
        return (
            <div className='cart'>
                <table className='cart__table'>
                    <tbody>
                        {
                            
                            items.map((item, i) => {
                                return (
                                    <CartItem cartManager={cartManager} item={item} product={getProduct(item.productId)} key={i}/>
                                )
                            })
                        }
                    </tbody>
                </table>

                <div className="cart__total">
                    Итого: <span className='cart__total-value'>{ amount } руб.</span>
                </div>
            </div>
        )
    }

    return (
        <h3>Корзина пуста</h3>
    )
}

export default Cart