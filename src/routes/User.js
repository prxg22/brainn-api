// /**
//  * @module Route.User
//  * @author Paulo Ricardo Xavier Giusti
//  */
//
// Import { User as UserDomain, Auth } from '../domains'
// Import APIError from '../lib/APIError'
// Import Route from '../lib/Route'
//
// /**
// * User route
// * @class
// * @alias modRoute.User
// */
// Class User extends Route {
//     Route = '/user'
//     Actions = {
//         '/' : {
//             Post: register,
//             Get: [
//                 Auth.authorizeMiddleware,
//                 (req, res, next) => res.send(req.user)
//             ]
//         },
//         '/login': {
//             Post: login,
//         }
//     }
// }
//
// /**
//  * User registration route
//  * @function
//  * @param {express.Request} req Express http request
//  * @param {express.Response} res Express http response
//  * @param {express.Next} next Express next function
//  * @return {void}
//  * @inner
//  */
// Const register = async (req, res, next) => {
//     Const { body } = req
//     // Check username and password
//
//
//     // Call user domain register function
//     Try {
//         If (!body || !body.username || !body.password) throw new APIError('CREDENTIALS_NOT_VALID')
//
//         Let user = null
//         User = await UserDomain.register(body)
//
//         Return res.send(user)
//     } catch (e) {
//         Return next(e)
//     }
//
//     // Send user object
// }
//
// /**
//  * User logins route
//  * @function
//  * @param {express.Request} req Express http request
//  * @param {express.Response} res Express http response
//  * @param {express.Next} next Express next function
//  * @return {void}
//  * @inner
//  */
// Const login = async (req, res, next) => {
//     Const { body } = req
//     Try {
//         If (!body || !body.username || !body.password) res.sendStatus(400)
//         Const token = await UserDomain.authenticate(body)
//         Res.send(token)
//     } catch(e) {
//         Next(e)
//     }
// }
//
// Export default User
