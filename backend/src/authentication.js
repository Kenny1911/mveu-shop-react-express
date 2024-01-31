const jwt = require('jsonwebtoken')
const { User, ROLE_ADMIN, ROLE_CUSTOMER } = require('./models/User')

class Authentication {
    constructor(secret, expiresIn = '24h') {
        this.secret = secret
        this.expiresIn = expiresIn
    }

    generateAccessToken = (user) => {
        return jwt.sign(
            { id: user._id, role: user.role },
            this.secret,
            { expiresIn: this.expiresIn }
        )
    }

    /**
     * @returns Current authenticated User or null
     */
    getUser = async (req) => {
        const authorization = req?.header('Authorization') ?? ''

        if (!authorization.startsWith('Bearer ')) {
            return null
        }

        const token = authorization.substr(7)

        if (!token) {
            return null;
        }

        try {
            const tokenPayload = jwt.verify(token, this.secret);

            return User.findOne({_id: tokenPayload.id})
        } catch (e) {
            return null;
        }
    }
}

module.exports = Authentication
