import { User } from "./api"

const userIsAdmin = (user: User): boolean => {
    return 'admin' === user.role
}

const userIsCustomer = (user: User): boolean => {
    return 'customer' === user.role
}

export { userIsAdmin, userIsCustomer }
