interface Item {
    productId: string
    count: number
}

interface CartManager {
    getItems(): Array<Item>

    getItem(productId: string): Item | null

    setItem(productId: string, count: number): void

    removeItem(productId: string): void
}

class CommonCartManager implements CartManager {
    items: Array<Item> = []

    getItems() {
        return this.items
    }

    getItem(productId: string) {
        for (const item of this.items) {
            if (item.productId === productId) {
                return item
            }
        }

        return null
    }

    setItem(productId: string, count: number) {
        this.removeItem(productId)

        if (count > 0) {
            this.items.push({
                productId: productId,
                count: Math.max(1, parseInt(count.toString()))
            })
            this.items = this.items.sort((a, b) => (a.productId < b.productId) ? -1 : ((a.productId > b.productId) ? 1 : 0))
        }
    }

    removeItem(productId: string) {
        this.items = this.items.filter(i => i.productId !== productId)
    }
}

class LocalStorageCartManager implements CartManager {
    private inner: CartManager

    private storage: Storage

    private key: string

    constructor(inner: CartManager, storage: Storage = localStorage, key: string = 'cart') {
        this.inner = inner
        this.storage = storage
        this.key = key
        
        const initData = JSON.parse(storage.getItem(this.key) ?? '[]') as Array<Item>

        for (const initItem of initData) {
            this.inner.setItem(initItem.productId, initItem.count)
        }
    }

    getItems() {
        return this.inner.getItems()
    }

    getItem(productId: string) {
        return this.inner.getItem(productId)
    }

    setItem(productId: string, count: number) {
        this.inner.setItem(productId, count)
        this.saveToLocalStorage()
    }

    removeItem(productId: string) {
        this.inner.removeItem(productId)
        this.saveToLocalStorage()
    }

    saveToLocalStorage() {
        this.storage.setItem(this.key, JSON.stringify(this.getItems()))
    }
}

interface CartEventDispatcher {
    addListener(listener: (items: Array<Item>) => void): void

    removeListener(listener: (items: Array<Item>) => void): void;
}

class EventDispatcherCartManager implements CartManager, CartEventDispatcher {
    private inner: CartManager

    private listeners: Array<(items: Array<Item>) => void> = []

    constructor(inner: CartManager) {
        this.inner = inner
    }

    addListener(listener: (items: Array<Item>) => void) {
        this.listeners.push(listener)
    }

    removeListener(listener: (items: Array<Item>) => void) {
        this.listeners = this.listeners.filter(l => listener !== l)
    }

    getItems() {
        return this.inner.getItems()
    }

    getItem(productId: string) {
        return this.inner.getItem(productId)
    }

    setItem(productId: string, count: number) {
        this.inner.setItem(productId, count)
        this.dispatch()
    }

    removeItem(productId: string) {
        this.inner.removeItem(productId)
        this.dispatch()
    }

    dispatch() {
        for(const listener of this.listeners) {
            listener(this.getItems())
        }
    }
}

export { type Item, type CartManager, CommonCartManager, LocalStorageCartManager, EventDispatcherCartManager, type CartEventDispatcher }