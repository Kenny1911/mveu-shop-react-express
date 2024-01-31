import React, { useEffect, useState } from 'react';
import Product from "../components/Product"
import { type Api, Product as ProductDto, User } from "../service/api"
import { cartManager, userManager } from '../services';
import { userIsAdmin } from '../service/utils';

const ProductsList = ({api, user, setPage}: {api: Api, user: User | null, setPage: (value: string) => void}) => {
    const [products, setProducts] = useState<Array<ProductDto>>([])

    const updateProducts = () => {
        api.getProducts().then(p => setProducts(p))
    }

    useEffect(updateProducts, [])
    // const products = await api.getProducts()

    const isAuth = !!user
    const isAdmin = isAuth && userIsAdmin(user)

    return (
        <>
        <h1>
            Товары
            { isAdmin ? <button className="btn add-product-btn" onClick={() => setPage('ProductFormPage')}>Новый товар</button> : null }
        </h1>
        <div className="products">
            {
                products.map((p, i) => {
                    const isAdded = !!(cartManager.getItem(p.id))

                    let addProduct = null
                    if (isAuth && !isAdded) {
                        addProduct = () => cartManager.setItem(p.id, 1)
                    }

                    let editProduct = null
                    let deleteProduct = null

                    if (isAdmin) {
                        editProduct = () => setPage(`ProductFormPage:${p.id}`)
                        deleteProduct = () => {
                            if (window.confirm('Вы уверены?')) {
                                api.deleteProduct(p.id)
                                    .then(() => updateProducts())
                                    .catch(() => alert('Произошла ошибка при удалении товара!'))
                            }
                        }
                    }

                    return (
                        <Product product={p} isAdded={isAdded} addProduct={addProduct} editProduct={editProduct} deleteProduct={deleteProduct} key={i} />
                    )
                })
            }
        </div>
        </>
    )
}

export default ProductsList