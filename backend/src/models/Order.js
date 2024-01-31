const { Schema, model } = require('mongoose')

const STATUS_NEW = 'new'
const STATUS_PROCESS = 'process'
const STATUS_COMPLETE = 'complete'
const STATUS_ABORT = 'abort'

const Order = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    items: [
        // Название, цена и фото товара дублируются для историчности
        // Со временем у самого товара они могут меняться, но в истории заказов данные должны оставаться такими, какими были в момент оформления заказа
        new Schema({
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            photo: {
                type: String,
            },
            count: {
                type: Number,
                required: true,
                min: 1,
            }
        })
    ],
    card: {
        type: new Schema({
            number: {
                type: String,
                required: true,
            },
            month: {
                type: String,
                required: true,
            },
            year: {
                type: String,
                required: true,
            },
            owner: {
                type: String,
                required: true,
            },
            cvv: {
                type: String,
                required: true,
            }
        }),
        required: true,
    },
    comment: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: [STATUS_NEW, STATUS_PROCESS, STATUS_COMPLETE, STATUS_ABORT],
        default: STATUS_NEW,

    },
    timestamp: {
        type: Schema.Types.Date,
    },
})

module.exports = {
    Order: model('Order', Order),
    STATUS_NEW: STATUS_NEW,
    STATUS_PROCESS: STATUS_PROCESS,
    STATUS_COMPLETE: STATUS_COMPLETE,
    STATUS_ABORT: STATUS_ABORT,
}
