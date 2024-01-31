interface MessageResponse {
    message: string
}

interface TokenResponse {
    message: string
    token: string
}

type UserRole = 'admin' | 'customer'

interface User {
    id: string
    login: string
    firstName: string
    lastName: string
    role: UserRole
}

interface UserRegister {
    login: string
    password: string
    firstName: string
    lastName: string
}

interface UserEdit {
    firstName: string
    lastName: string
}

interface Product {
    id: string
    title: string
    price: number 
    photo?: string
}

interface ProductEdit {
    title: string
    price: number 
    photo?: string
}

interface Order {
    id: string
    user?: User
    amount: number
    items: Array<OrderItem>
    card: string
    comment?: string
    status: OrderStatus
    timestamp: Date
}

interface OrderItem {
    productId: string
    title: string
    price: number
    photo?: string
    count: number
}

interface OrderCreate {
    items: Array<{productId: string, count: number}>,
    card: {
        number: string,
        month: string,
        year: string,
        owner: string,
        cvv: string,
    },
    comment: string
}

type OrderStatus = 'new' | 'process' | 'complete' | 'abort'

interface Api {
    register(register: UserRegister): Promise<MessageResponse>

    login(login: string, password: string): Promise<TokenResponse>

    setToken(token: string | null): void

    getUser(): Promise<User|null>

    editUser(userEdit: UserEdit): Promise<User>

    changePassword(password: string): Promise<MessageResponse>

    getProducts(): Promise<Array<Product>>

    getProduct(id: string): Promise<Product | null>

    createProduct(data: ProductEdit): Promise<Product>

    editProduct(id: string, data: ProductEdit): Promise<Product>

    deleteProduct(id: string): Promise<null>

    createOrder(data: OrderCreate): Promise<Order>

    myOrders(): Promise<Array<Order>>

    getOrders(): Promise<Array<Order>>

    changeOrderStatus(id: string, status: OrderStatus): Promise<Order>
}

class FakeApi implements Api {
    private user: string | null = null

    private readonly storage: Storage

    private readonly storageKey: string

    private users: Array<User & {password: string}> = [
        {
            id: '1',
            login: 'admin',
            firstName: 'Админ',
            lastName: 'Админов',
            role: 'admin',
            password: '123',
        },
        {
            id: '2',
            login: 'user',
            firstName: 'Иван',
            lastName: 'Иванов',
            role: 'customer',
            password: '123',
        }
    ]

    private products: Array<Product> = [
        {
            id: '1',
            title: 'Смартфон HUAWEI nova 11 8/256GB Black (FOA-LX9)',
            price: 32999,
            photo: 'https://img.mvideo.ru/Big/400154553bb.jpg',
        },
        {
            id: '2',
            title: 'Стиральная машина узкая Haier HW60-BP12919A',
            price: 29999,
            photo: 'https://img.mvideo.ru/Big/20083479bb.jpg',
        },
        {
            id: '3',
            title: 'Телевизор Яндекс ТВ Станция с Алисой 50"',
            price: 39999,
        },
    ]

    private orders: Array<Order> = []

    constructor(storage: Storage = localStorage, storageKey: string = 'db') {
        this.storage = storage
        this.storageKey = storageKey
        this.loadFromStorage()
        this.saveInStorage()
    }

    async register(register: UserRegister): Promise<MessageResponse> {
        for (const u of this.users) {
            if (u.login === register.login) {
                throw new Error('Пользователь с таким именем уже зарегистрирован')
            }
        }

        const user: User & {password: string} = {
            id: new Date().getTime().toString(),
            ...register,
            role: 'customer',
        }
        
        this.users.push(user)

        this.saveInStorage()

        return {message: 'Вы успешно зарегистрировались'}
    }

    async login(login: string, password: string): Promise<TokenResponse> {
        for (let u of this.users) {
            if (u.login === login && u.password === password) {
                return {token: u.login, message: 'Ok'}
            }
        }

        throw new Error('Неверный логин или пароль')
    }

    setToken(token: string | null) {
        this.user = token
    }

    async getUser(): Promise<User|null> {
        try {
            return await this.getCurrentUser()
        } catch {
            return null
        }
    }

    async editUser(userEdit: UserEdit): Promise<User> {
        const user = await this.getCurrentUser()
        
        user.firstName = userEdit.firstName
        user.lastName = userEdit.lastName

        this.saveInStorage()

        return user
    }

    async changePassword(password: string): Promise<MessageResponse> {
        const user = await this.getCurrentUser()

        user.password = password

        this.saveInStorage()

        return {message: 'Пароль изменен'}
    }

    async getProducts(): Promise<Array<Product>> {
        return this.products
    }

    async getProduct(id: string): Promise<Product | null> {
        for (let product of this.products) {
            if (product.id === id) {
                return product
            }
        }

        return null
    }

    async createProduct(data: ProductEdit): Promise<Product> {
        const id = new Date().getTime().toString()
        const product: Product = {id, ...data}
        this.products.push(product)

        this.saveInStorage()

        return product
    }

    async editProduct(id: string, data: ProductEdit): Promise<Product> {
        const product = await this.getProduct(id)

        if (!product) {
            throw new Error('Product not found')
        }

        product.title = data.title
        product.price = data.price
        product.photo = data.photo

        this.saveInStorage()

        return product
    }

    async deleteProduct(id: string): Promise<null> {
        this.products = this.products.filter((p) => p.id !== id)

        this.saveInStorage()

        return null
    }

    async createOrder(data: OrderCreate): Promise<Order> {
        const id = new Date().getTime().toString()
        const user = await this.getCurrentUser()
        let items: Array<OrderItem> = []
        let amount = 0
        
        for (const item of data.items) {
            const product = await this.getProduct(item.productId)
            items.push({
                productId: item.productId,
                count: item.count,
                title: product?.title ?? 'Invalid product',
                price: product?.price ?? 0,
                photo: product?.photo
            })
            amount += product?.price ?? 0
        }

        const order: Order = {
            id,
            user,
            amount,
            items,
            card: data.card.number,
            comment: data.comment,
            status: 'new',
            timestamp: new Date(),
        }

        this.orders.push(order)

        this.saveInStorage()

        return order
    }

    async myOrders(): Promise<Order[]> {
        const user = await this.getCurrentUser()

        return this.orders.filter(o => o.user?.id === user.id)
    }

    async getOrders(): Promise<Order[]> {
        return this.orders
    }

    async changeOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        let order: Order | null = null

        for (const o of this.orders) {
            if (o.id === id) {
                order = o
                break
            }
        }

        if (!order) {
            throw new Error('Заказ не найден')
        }

        order.status = status

        this.saveInStorage()

        return order
    }

    private async getCurrentUser(): Promise<User & {password: string}> {
        for (const u of this.users) {
            if (u.login === this.user) {
                return u
            }
        }

        throw new Error('Вы не авторизованы')
    }

    private loadFromStorage(): void
    {
        const usersRaw = this.storage.getItem(`${this.storageKey}.users`)

        if (usersRaw) {
            this.users = JSON.parse(usersRaw)
        }

        const productsRaw = this.storage.getItem(`${this.storageKey}.products`)

        if (productsRaw) {
            this.products = JSON.parse(productsRaw)
        }

        const ordersRaw = this.storage.getItem(`${this.storageKey}.orders`)

        if (ordersRaw) {
            this.orders = JSON.parse(ordersRaw)
        }
    }

    private saveInStorage(): void {
        this.storage.setItem(`${this.storageKey}.users`, JSON.stringify(this.users))
        this.storage.setItem(`${this.storageKey}.products`, JSON.stringify(this.products))
        this.storage.setItem(`${this.storageKey}.orders`, JSON.stringify(this.orders))
    }
}

class FetchApi implements Api {
    private url: string
    private token: string | null = null

    constructor(url: string) {
        this.url = url
    }

    register(register: UserRegister): Promise<MessageResponse> {
        return this.request<MessageResponse>('/registration', 'POST', register)
    }

    login(login: string, password: string): Promise<TokenResponse> {
        return this.request<TokenResponse>('/login', 'POST', {login, password})
    }

    setToken(token: string | null) {
        this.token = token
    }

    async getUser(): Promise<User|null> {
        
        if (!this.token) {
            return null
        }

        return this.request<User>('/account', 'GET')
    }

    editUser(userEdit: UserEdit): Promise<User> {
        return this.request<User>('/account', 'PATCH', userEdit)
    }

    changePassword(password: string): Promise<MessageResponse> {
        return this.request<MessageResponse>('/account/change-password', 'PATCH', {password})
    }

    async getProducts(): Promise<Array<Product>> {
        return this.request<Array<Product>>('/products', 'GET')
    }

    async getProduct(id: string): Promise<Product|null> {
        const products = await this.getProducts()

        for (const product of products) {
            if (product.id === id) {
                return product
            }
        }

        return null
    }

    async createProduct(data: ProductEdit): Promise<Product> {
        return this.request<Product>('/products', 'POST', data)
    }

    async editProduct(id: string, data: ProductEdit): Promise<Product> {
        return this.request<Product>(`/product/${id}`, 'PATCH', data)
    }

    async deleteProduct(id: string): Promise<null> {
        return this.request<null>(`/product/${id}`, 'DELETE')
    }

    async createOrder(data: OrderCreate): Promise<Order> {
        return this.request<Order>('/orders', 'POST', data)
    }

    async myOrders(): Promise<Array<Order>> {
        return this.request<Array<Order>>('/orders/my', 'GET')
    }

    async getOrders(): Promise<Array<Order>> {
        return this.request<Array<Order>>('/orders', 'GET')
    }

    async changeOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        // todo
        return this.request(`/order/${id}/change-status`, 'PATCH', {status})
    }

    private async request<T = any>(path: string, method: string = 'GET', data: any = undefined): Promise<T> {
        const headers: {[key: string]: string} = {
            'Content-Type': 'application/json',
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`
        }

        const requestInit: RequestInit = { method, headers }

        if ('HEAD' !== method && 'GET' !== method && undefined !== data) {
            requestInit.body = JSON.stringify(data)
        }

        //console.log({ url: this.url + path, ...requestInit })

        return fetch(this.url + path, requestInit)
            .then(async r => {
                if (r.status >= 400 && r.status < 600) {
                    throw new Error("Bad response from server");
                }

                return r.json()
            })
    }
}

class TokenStorageApi implements Api {
    private readonly inner: Api
    private readonly storage: Storage
    private readonly storageKey: string

    constructor(inner: Api, storage: Storage = localStorage, storageKey: string = 'token') {
        this.inner = inner
        this.storage = storage
        this.storageKey = storageKey
        
        this.setToken(this.storage.getItem(this.storageKey))
    }

    register(register: UserRegister): Promise<MessageResponse> {
        return this.inner.register(register)
    }

    login(login: string, password: string): Promise<TokenResponse> {
        return this.inner.login(login, password)
    }

    setToken(token: string | null): void {  
        this.inner.setToken(token)

        if (null !== token) {
            this.storage.setItem(this.storageKey, token)
        } else {
            this.storage.removeItem(this.storageKey)
        }
    }

    getUser(): Promise<User | null> {
        return this.inner.getUser()
    }

    editUser(userEdit: UserEdit): Promise<User> {
        return this.inner.editUser(userEdit)
    }

    changePassword(password: string): Promise<MessageResponse> {
        return this.inner.changePassword(password)
    }

    getProducts(): Promise<Product[]> {
        return this.inner.getProducts()
    }
    getProduct(id: string): Promise<Product | null> {
        return this.inner.getProduct(id)
    }

    createProduct(data: ProductEdit): Promise<Product> {
        return this.inner.createProduct(data)
    }

    editProduct(id: string, data: ProductEdit): Promise<Product> {
        return this.inner.editProduct(id, data)
    }

    deleteProduct(id: string): Promise<null> {
        return this.inner.deleteProduct(id)
    }

    createOrder(data: OrderCreate): Promise<Order> {
        return this.inner.createOrder(data)
    }

    myOrders(): Promise<Order[]> {
        return this.inner.myOrders()
    }

    getOrders(): Promise<Order[]> {
        return this.inner.getOrders()
    }

    changeOrderStatus(id: string, status: OrderStatus): Promise<Order> {
        return this.inner.changeOrderStatus(id, status)
    }
}

export {
    type User,
    type Product,
    type Order,
    type OrderItem,
    type OrderStatus,
    type Api,
    FakeApi,
    FetchApi,
    TokenStorageApi,
}
