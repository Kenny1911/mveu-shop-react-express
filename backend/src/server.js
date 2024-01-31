const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Authentication = require('./authentication')
const dto = require('./dto')
const {User, ROLE_CUSTOMER, ROLE_ADMIN} = require('./models/User')
const Product = require('./models/Product')
const {Order, STATUS_NEW, STATUS_PROCESS, STATUS_COMPLETE, STATUS_ABORT} = require('./models/Order')

// Middleware for check authorization
const grantAccess = (auth, role = null) => {
    return async (req, res, next) => {
        const user = await auth.getUser(req);

        if (!user || (role && user.role !== role)) {
            return res.status(400).json({message: 'Доступ запрещен'})
        }
    
        next();
    }
}

// Function for run server
module.exports = (settings) => {
    // Init settings
    const APP_HOST = settings.APP_HOST || '127.0.0.1';
    const APP_PORT = settings.APP_PORT || 9000;
    const MONGO_URL = settings.MONGO_URL || 'mongodb://127.0.0.1:27017';
    const JWT_SECRET = settings.JWT_SECRET || 'mveu';
    const JWT_EXPIRES = settings.JWT_EXPIRES || '24h';

    const auth = new Authentication(JWT_SECRET, JWT_EXPIRES)

    const app = express()

    app.use(cors())
    app.use(express.json())

    app.post('/registration', async (req, res) => {
        const { login, password, firstName, lastName } = req.body
        
        if (await User.countDocuments({login: login}) > 0) {
            return res.status(409).json({message: 'Пользователь с таким логином уже существует!'})
        }

        const user = new User({login, password, firstName, lastName, role: ROLE_CUSTOMER})
        await user.save()
        
        return res.json({
            message: 'Вы успешно зарегистрировались!'
        })
    })

    app.post('/login', async (req, res) => {
        const {login, password} = req.body
        const user = await User.findOne({login})

        if (!(user && user.password === password)) {
            return res.status(400).json({message: 'Неверный логин или пароль!'})
        }

        return res.json({
            message: 'Вы успешно авторизованы!',
            token: auth.generateAccessToken(user),
        })
    })

    // Account routes
    app.get('/account', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)
        
        return res.json(dto.userToDto(user))
    })

    app.patch('/account', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)
        const {firstName, lastName} = req.body

        user.firstName = firstName
        user.lastName = lastName

        await user.save()

        res.json(dto.userToDto(user))
    })

    app.patch('/account/change-password', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)
        const password = req.body.password

        user.password = password
        await user.save()

        return res.json({
            message: 'Вы успешно поменяли пароль.'
        })
    })

    // Product routes
    app.get('/products', async (_, res) => {
        const products = await Product.find()

        return res.json(products.map(dto.productToDto))
        // return res.json({
        //     items: products.map(dto.productToDto),
        //     count: products.length,
        // })
    })

    app.post('/products', grantAccess(auth, ROLE_ADMIN), async (req, res) => {
        const {title, price, photo} = req.body

        const product = new Product({title, price, photo})
        await product.save()

        return res.json(dto.productToDto(product))
    })

    app.patch('/product/:id', grantAccess(auth, ROLE_ADMIN), async (req, res) => {
        const product = await Product.findById(req.params.id).exec()

        if (!product) {
            res.status(404).json({message: 'Товар не найден!'})
        }

        const {title, price, photo} = req.body
        product.title = title
        product.price = price
        product.photo = photo

        await product.save()

        return res.json(dto.productToDto(product))
    })

    app.delete('/product/:id', grantAccess(auth, ROLE_ADMIN), async (req, res) => {
        await Product.deleteOne({_id: req.params.id})

        return res.json(null).status(204)
    })

    // Orders routes
    app.get('/orders', grantAccess(auth, ROLE_ADMIN), async (req, res) => {
        const orders = await Order.find().sort([['timestamp', -1]]).exec()

        res.json(await Promise.all(orders.map(dto.orderToDto)))
        // return res.json({
        //     items: await Promise.all(orders.map(dto.orderToDto)),
        //     count: orders.length,
        // })
    })

    app.post('/orders', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)

        let items = []

        for (const item of req.body?.items ?? []) {
            const productId = item.productId
            const product = await Product.findOne({_id: productId})

            if (!product) {
                return res.status(400).json({message: `Товар с id ${productId} не найден`})
            }

            items.push({
                productId,
                title: product.title,
                price: product.price,
                photo: product.photo,
                count: item.count || 1,
            })
        }

        const amount = items.reduce((a, item) => a + item.price * item.count, 0)

        const order = new Order({
            userId: user._id,
            amount,
            items,
            card: req.body?.card,
            comment: req.body?.comment,
            status: STATUS_NEW,
            timestamp: new Date()
        })
        await order.save()

        return res.json(await dto.orderToDto(order))
    })

    app.get('/orders/my', grantAccess(auth), async (req, res) => {
        const user = await auth.getUser(req)

        const orders = await Order.find({userId: user._id}).sort([['timestamp', -1]]).exec()

        return res.json(await Promise.all(orders.map(dto.orderToDto)))
        // return res.json({
        //     items: await Promise.all(orders.map(dto.orderToDto)),
        //     count: orders.length,
        // })
    })

    app.patch('/order/:id/change-status', grantAccess(auth, ROLE_ADMIN), async (req, res) => {
        const order = await Order.findOne({_id: req.params.id})

        if (!order) {
            res.status(404).json({message: 'Заказ не найден!'})
        }

        order.status = req.body?.status
        await order.save()

        return res.json(dto.orderToDto(order))
    })

    app.delete('/order/:id', grantAccess(auth, ROLE_ADMIN), async (req, res) => {
        await Order.deleteOne({_id: req.params.id})

        return res.json(null).status(204)
    })
    
    // Async function to start server
    const start = async () => {
        try {
            console.log('Start server')

            console.log('Try connect to Mongo')
            await mongoose.connect(MONGO_URL, {authSource: "admin"})
            console.log('Connected')

            // Create admin user, if not exists
            if (0 === await User.countDocuments({login: 'admin'})) {
                const admin = new User({login: 'admin', password: '123', firstName: 'Admin', lastName: 'Admin', role: ROLE_ADMIN})
                await admin.save()

                console.log(`Automatic create super-user "${admin.login}" with password "${admin.password}"`)
            }

            app.listen(APP_PORT, APP_HOST, () => console.log(`Server listen ${APP_HOST}:${APP_PORT}`))
        } catch (e) {
            console.log(e)
        }
    }

    start()
}
