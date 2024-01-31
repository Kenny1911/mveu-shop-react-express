import React, { useState } from 'react';
import { User } from "../service/api"
import { CartManager } from '../service/cart';
import { userIsAdmin } from '../service/utils';

interface HeaderArgs {
    setPage: (value: string) => void
    user: User|null
    logout: () => void
    cartManager: CartManager
}

const Header = ({setPage, user, logout, cartManager}: HeaderArgs) => {
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
    
    const isAuth = !!user
    const isAdmin = isAuth && userIsAdmin(user)

    let menuItems: Array<{title: string, callback: () => void}> = [
        {title: 'Товары', callback: () => setPage('ProductsList')},
    ]

    if (isAuth) {
        menuItems.push({title: 'Аккаунт', callback: () => setPage('Account')})
        menuItems.push({title: 'Мои заказы', callback: () => setPage('MyOrders')})
        menuItems.push({title: 'Корзина', callback: () => setPage('Cart')})
    }

    if (isAdmin) {
        menuItems.push({title: 'Заказы', callback: () => setPage('Orders')})
    }

    if (isAuth) {
        menuItems.push({title: 'Выйти', callback: () => logout()})
    } else {
        menuItems.push({title: 'Войти', callback: () => setPage('Login')})
        menuItems.push({title: 'Зарегистрироваться', callback: () => setPage('Register')})
    }

    return (
        <header>
            <div className="container header__container">
                <div className='header__mobile-menu-btn-wrapper'>
                    <button className='header__mobile-menu-btn' onClick={() => setShowMobileMenu(!showMobileMenu)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </button>
                </div>
                
                <div className="header__menu-wrapper">
                    <ul className={`header__menu ${showMobileMenu ? 'header__menu--open' : ''}`}>
                        { menuItems.map((item, i) => {
                            return (
                                <li onClick={item.callback} key={i}>{ item.title }</li>
                            )
                        }) }
                    </ul>
                </div>

                <div className="header__logo"><img src='/logo192.png'/></div>
            </div>
        </header>
    )
}

export default Header