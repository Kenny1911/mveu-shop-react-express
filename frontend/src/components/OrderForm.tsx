import React, { useState } from 'react';
import { CartManager } from '../service/cart';
import { Api, Product } from '../service/api';

interface CartArgs {
    cartManager: CartManager
    api: Api
    setPage: (value: string) => void
}

type Setter<T> = (value: T) => void
type ValueHandler = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void

const OrderForm = ({cartManager, api, setPage}: CartArgs) => {
    const valueHandler = (setter: Setter<string>): ValueHandler => {
        return (e) => setter(e.target.value)
    }

    const [cardNumber, setCardNumber] = useState('')
    const [cardMonth, setCardMonth] = useState('')
    const [cardYear, setCardYear] = useState('')
    const [cardOwner, setCardOwner] = useState('')
    const [cardCvv, setCardCvv] = useState('')
    const [comment, setComment] = useState('')

    const cardNumberHandler: ValueHandler = (e) => {
        const value = e.target.value.replace(/\D/g, '').match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);

        let maskValue = ''
        
        if (value) {
            maskValue += value[1] ? value[1] : ''
            maskValue += value[2] ? '-'+value[2] : ''
            maskValue += value[3] ? '-'+value[3] : ''
            maskValue += value[4] ? '-'+value[4] : ''
        }

        setCardNumber(maskValue)
    }

    const constCardValidityHandler = (setter: Setter<string>): ValueHandler => {
        return (e) => {
            const value = e.target.value.replace(/\D/g, '').match(/(\d{0,2})/)
            
            if (value) {
                setter(value[1] ?? '')
            } else {
                setter('')
            }
        }
    }

    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        const orderData = {
            items: cartManager.getItems(),
            card: {
                number: cardNumber,
                month: cardMonth,
                year: cardYear,
                owner: cardOwner,
                cvv: cardCvv,
            },
            comment
        }

        api.createOrder(orderData).then((o) => {
            alert(`Заказ ${o.id} был успешно создан`)
            // Очистка корзины
            cartManager.getItems().map((i) => cartManager.removeItem(i.productId))
            // Переход на страницу товаров
            setPage('ProductsList')
        }).catch(() => {
            alert('Ошибка! Заказ не был оформлен.')
        })
    }

    return (
        <form className="form order-form" onSubmit={submit}>
            <div className="form-control">
                <label>Номер карты*</label>
                <input className="input input-block" placeholder="0000-0000-0000-0000" type='text' pattern='\d{4}-\d{4}-\d{4}-\d{4}' maxLength={19} required value={cardNumber} onChange={cardNumberHandler}/>
            </div>
            <div className="form-control">
                <label>Срок действия*</label>
                <div className='order-form__card-validity'>
                    <input className="input" placeholder={`${(new Date().getMonth() + 1).toString().padStart(2, '0')} (Месяц)`} type="text" pattern='\d{2}' maxLength={2} required value={cardMonth} onChange={constCardValidityHandler(setCardMonth)} />
                    <input className="input" placeholder={`${(new Date().getFullYear() % 100).toString().padStart(2, '0')} (Год)`} type="text" pattern='\d{2}' maxLength={2} required value={cardYear} onChange={constCardValidityHandler(setCardYear)} />
                </div>
            </div>
            <div className="form-control">
                <label>Владелец*</label>
                <input className="input input-block" placeholder='Ivanov Ivan' type='text' required value={cardOwner} onChange={valueHandler(setCardOwner)}/>
            </div>
            <div className="form-control">
                <label>Card cvv*</label>
                <input className="input input-block" placeholder="000" type='password' pattern='\d{3}' maxLength={3} required value={cardCvv} onChange={valueHandler(setCardCvv)}/>
            </div>
            <div className="form-control">
                <label>Комментарий к заказу</label>
                <textarea className='textarea textarea-block' name="comment" value={comment} onChange={valueHandler(setComment)}></textarea>
            </div>
            <div className="form-control">
                <input className="btn btn-block btn-success" type='submit' value="Оформить заказ" />
            </div>
        </form>
    )
}

export default OrderForm
