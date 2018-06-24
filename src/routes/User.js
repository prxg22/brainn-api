/**
 * @module Route.User
 * @author Paulo Ricardo Xavier Giusti
 */

import { User as UserDomain, Auth } from '../domains'
import APIError from '../lib/APIError'
import Route from '../lib/Route'

/**
* User route
* @class
* @alias modRoute.User
*/
class User extends Route {
    route = '/user'
    actions = {
        '/' : {
            post: register,
            get: [
                Auth.authorizeMiddleware,
                (req, res, next) => res.send(req.user)
            ]
        },
        '/login': {
            post: login,
        }
    }
}

/**
 * User registration route
 * @function
 * @param {express.Request} req Express http request
 * @param {express.Response} res Express http response
 * @param {express.Next} next Express next function
 * @return {void}
 * @inner
 */
const register = async (req, res, next) => {
    const { body } = req
    // Check username and password


    // Call user domain register function
    try {
        if (!body || !body.username || !body.password) throw new APIError('CREDENTIALS_NOT_VALID')

        let user = null
        user = await UserDomain.register(body)

        return res.send(user)
    } catch (e) {
        return next(e)
    }

    // Send user object
}

/**
 * User logins route
 * @function
 * @param {express.Request} req Express http request
 * @param {express.Response} res Express http response
 * @param {express.Next} next Express next function
 * @return {void}
 * @inner
 */
const login = async (req, res, next) => {
    const { body } = req
    try {
        if (!body || !body.username || !body.password) res.sendStatus(400)
        const token = await UserDomain.authenticate(body)
        res.send(token)
    } catch(e) {
        next(e)
    }
}

export default User
