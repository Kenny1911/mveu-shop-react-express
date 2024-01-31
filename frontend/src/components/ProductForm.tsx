import React, { useState } from "react";
import { Api, Product } from '../service/api'

const ProductForm = ({api, product, afterSave}: {api: Api, product: Product | null, afterSave: () => void}) => {
    const [title, setTitle] = useState<string>(product?.title ?? '')
    const [price, setPrice] = useState<number>(product?.price ?? 0)
    const [photo, setPhoto] = useState<string|null>(product?.photo ?? null)

    // todo implement saving
    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        const data = {title, price, photo: photo ?? undefined}

        const request = (!!product) ? api.editProduct(product.id, data) : api.createProduct(data)

        request
            .then(() => afterSave())
            .catch(() => alert('Ошибка при сохранении'))
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label>Название*</label>
                <div>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
            </div>

            <div>
                <label>Цена*</label>
                <div>
                    <input type="number" min="0" required value={price} onChange={(e) => setPrice(parseInt(e.target.value))}/>
                </div>
            </div>

            <div>
                <label>Ссылка на изображение</label>
                <div>
                    <input type="text" value={photo || ''} onChange={(e) => setPhoto(e.target.value || null)}/>
                </div>
                <div>
                    { (photo) ? <img src={photo} /> : 'Нет изображения' }
                </div>
            </div>

            <div>
                <input type="submit" value="Сохранить" />
            </div>
        </form>
    )
}

export default ProductForm
