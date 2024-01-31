const { Schema, model } = require('mongoose')

const Product = new Schema({
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
})

module.exports = model('Product', Product)
