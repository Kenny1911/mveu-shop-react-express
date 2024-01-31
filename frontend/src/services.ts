import { Api, FakeApi, FetchApi, TokenStorageApi } from "./service/api";
import { CartManager, CommonCartManager, LocalStorageCartManager, EventDispatcherCartManager, CartEventDispatcher } from "./service/cart";
import UserManager from "./service/user";

const apiUrl = process.env.REACT_APP_API
const api: Api = new TokenStorageApi(
    apiUrl ? new FetchApi(apiUrl) : new FakeApi()
)

const userManager: UserManager = new UserManager(api)

const commonCartManager = new CommonCartManager()
const eventDispatcherCartManager = new EventDispatcherCartManager(commonCartManager)
const localStorageCartManager = new LocalStorageCartManager(eventDispatcherCartManager)
const cartManager: CartManager = localStorageCartManager
const cartEventDispatcher: CartEventDispatcher =  eventDispatcherCartManager

export {api, userManager, cartManager, cartEventDispatcher}

