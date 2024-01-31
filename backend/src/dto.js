const User = require('./models/User').User

const userToDto = (user) => {
    return {
        id: user._id,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    }
}

const productToDto = (product) => {
    return {
        id: product._id,
        title: product.title,
        price: product.price,
        photo: product.photo,
    }
}

const orderToDto = async (order) => {
    const user = await User.findOne({_id: order.userId}).exec()

    return {
        id: order._id,
        user: user ? userToDto(user) : undefined,
        amount: order.amount,
        items: order.items.map((item) => {
            return {
                productId: item.productId,
                title: item.title,
                price: item.price,
                photo: item.photo,
                count: item.count,
            }
        }),
        card: order.card.number,
        comment: order.commend,
        status: order.status,
        timestamp: order.timestamp,
    }
}

module.exports = {
    userToDto,
    productToDto,
    orderToDto,
}