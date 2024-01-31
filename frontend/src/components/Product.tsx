import React from 'react';
import { Product as ProductDto } from '../service/api';
import { CartManager } from '../service/cart';

interface ProductArgs {
    product: ProductDto
    isAdded: boolean
    addProduct: (() => void) | null
    editProduct: (() => void) | null
    deleteProduct: (() => void) | null
}

export const Product = ({product, isAdded, addProduct, editProduct, deleteProduct}: ProductArgs) => {
    return (
        <div className="product">
            <div className="product__control">
                { (() => {
                    if (!!editProduct) {
                        return (
                            <button className="btn btn-small btn-success" onClick={ editProduct }>Редактировать</button>
                        )
                    }
                })() }

                { (() => {
                    if (!!deleteProduct) {
                        return (
                            <button className="btn btn-small btn-danger" onClick={ deleteProduct }>Удалить</button>
                        )
                    }
                })() }
            </div>
            
            <div className="product__photo">
                <img src={ product.photo ?? '/placeholder.jpg' }/>
            </div>
            <div className='product__title'>{product.title}</div>
            <div className='product__price'>{product.price} руб.</div>

            { (() => {
                if (isAdded) {
                    return (
                        <div className="product__is-added">Товар уже добавлен в корзину</div>
                    )
                } else if (!!addProduct) {
                    return (
                        <div className="product__add-button">
                            <button className="btn" onClick={addProduct}>Добавить в корзину</button>
                        </div>
                    )
                }

                return null
            })() }
            
        </div>
    )
}

export default Product