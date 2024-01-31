import { Api, User } from "./api"

class UserManager {
    private readonly api: Api

    constructor(api: Api) {
        this.api = api
    }

    getCurrent = async () => {
        return this.api.getUser()
    }

    isAdmin = (user: User) => {
        return 'admin' === user.role
    }
    
    isCustomer = (user: User) => {
        return 'customer' === user.role
    }
}

export default UserManager
