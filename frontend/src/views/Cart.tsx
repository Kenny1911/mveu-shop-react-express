import React, { useEffect, useState } from 'react';
import { CartManager } from '../service/cart';
import { Api, Product } from '../service/api';
import CartForm from '../components/Cart';
import OrderForm from '../components/OrderForm';

interface CartArgs {
    cartManager: CartManager
    api: Api
    setPage: (value: string) => void
}

const Cart = ({cartManager, api, setPage}: CartArgs) => {
    const [prodcuts, setProducts] = useState<Array<Product>>([])

    useEffect(() => {
        api.getProducts().then(p => setProducts(p))
    }, [])

    const getProduct = (id: string): Product => {
        for (let p of prodcuts) {
          if (p.id === id) {
            return p
          }  
        }
    
        return {
          id: '0',
          price: 0,
          title: 'Invalid'
        }
      }

    return (
        <>
        <h1>Корзина</h1>
        <CartForm cartManager={cartManager} getProduct={getProduct} />

        {
          (() => {
            if (cartManager.getItems().length > 0) {
              return (
                <>
                <br/>
                <h1>Оформление заказа</h1>
                <div className='order-form-wrapper'>
                  <OrderForm cartManager={cartManager} api={api} setPage={setPage} />
                </div>
                </>
              )
            }
          })()
        }
        </>
    )
}

export default Cart