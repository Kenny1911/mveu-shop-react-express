import React, {useEffect, useState} from 'react'
import { Api, Product } from '../service/api'
import ProductForm from '../components/ProductForm'


const ProductFormPage = ({api, productId, setPage}: {api: Api, productId: string | null, setPage: (value: string) => void}) => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [product, setProduct] = useState<Product|null>(null)

    useEffect(() => {
        if (!productId) {
            setLoaded(true)
            return
        }

        api.getProduct(productId).then(p => {
            setProduct(p)
            setLoaded(true)
        })
    }, [])

    if (loaded) {
        return (
            <>
            <h1>{ product ? `Редактирование: ${product.title}` : 'Новый товар' }</h1>
            <ProductForm api={api} product={product} afterSave={() => setPage('ProductsList')} />
            </>
        )
    }

    return (
        <p>Загрузка</p>
    )
}

export default ProductFormPage
