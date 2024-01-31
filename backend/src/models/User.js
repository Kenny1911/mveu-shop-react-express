const { Schema, model } = require('mongoose')

const ROLE_ADMIN = 'admin';
const ROLE_CUSTOMER = 'customer';

const User = new Schema({
    login: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: [ROLE_ADMIN, ROLE_CUSTOMER]
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
})

module.exports = {
    User: model('User', User),
    ROLE_ADMIN: ROLE_ADMIN,
    ROLE_CUSTOMER: ROLE_CUSTOMER,
}
