import React, { useState, useEffect } from 'react';
import {api, userManager, cartManager, cartEventDispatcher} from './services'
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductsList from './views/ProductsList'
import Cart from './views/Cart'
import Account from './views/Account'
import Login from './views/Login'
import Register from './views/Register'
import MyOrders from './views/MyOrders'
import ProductFormPage from './views/ProductFormPage'
import Orders from './views/Orders'
import { User, Product } from './service/api';
import { Item } from './service/cart'

const App = () => {
  const [page, setPage] = useState<string>('ProductsList')

  const [user, setUser] = useState<User|null>(null)

  const logout = () => {
    api.setToken(null)
    setUser(null)
    setPage('ProductsList')
  }

  useEffect(() => {
    userManager.getCurrent().then(u => {setUser(u)})
  }, [])

  // Set cart wrapper fo rusing localStorage
  const [cart, setCart] = useState<Array<Item>>(cartManager.getItems())
  cartEventDispatcher.addListener((items: Array<Item>) => setCart(items));



  const showPage = (): JSX.Element | null => {
    if (page.startsWith('ProductFormPage:')) {
      const productId = page.split(':', 2)[1]

      return <ProductFormPage api={api} productId={productId} setPage={setPage}/>
    }

    const pages: {[key: string]: JSX.Element} = {
      ProductsList: <ProductsList setPage={setPage} api={api} user={user} />,
      Cart: <Cart cartManager={cartManager} api={api} setPage={setPage} />,
      Account: <Account api={api} />,
      Login: <Login api={api} setUser={setUser} setPage={setPage} />,
      Register: <Register api={api} setPage={setPage} />,
      MyOrders: <MyOrders api={api}/>,
      ProductFormPage: <ProductFormPage api={api} productId={null} setPage={setPage} />,
      Orders: <Orders api={api} />
      // todo orders
    }

    return pages[page] ?? null
  }

  return (
    <>
      <Header user={user} setPage={setPage} logout={logout} cartManager={cartManager} />
      <div className="container">
        { showPage() }
      </div>
      <Footer/>
    </>
  );
}

export default App;
