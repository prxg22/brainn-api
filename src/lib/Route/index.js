/**
 * @module libs/Route
 * @author Paulo Ricardo Xavier Giusti
 */

 /**
 * Describes an route action
 * @typedef ActionDescription
 * @param {String} <HTTP_METHOD> Action HTTP method
 * @param {external:Express#Middleware|Array<external:Express#Middleware>} action Array of or callback to be called on route
 */

 /**
 * Describes a route with your methods and actions
 * @typedef RouteDescription
 * @param {String} <ROUTE_PATH> Route path with paramaters
 * @param {ActionDescription} actionDescription
 */

// imports
import { Router } from 'express'

 /**
  * Describes API route.
  * You should not instaciate this class. It should be extended by your routes.
  * @class
  * @alias module:libs/Route
  */
class Route {
    /**
     * @param router {external:Express#Router} router in which route will be used
     */
    constructor(router) {
        let err = null

        // router checking
        if (!router || !(Object.getPrototypeOf(router) == Router)) throw new Error('Invalid router')

        // setting router
        this.router = router
    }

    /**
     * Set route actions on router
     * @method
     * @returns {void}
     * @throws {Error} if `this.route` is invalid
     */
    init = () => {
        const { actions, router, route } = this

        if (!route || typeof route !== 'string' || route[0] !== '/') throw new Error(`Invalid route! ${route}`)
        if (!actions || typeof actions !== 'object') throw new Error(`Invalid actions! ${actions}`)
        // set routes on router
        try {
            Object.entries(actions).forEach((routeDescription) => {
                setRoute(route, router, routeDescription)
            })
        } catch(e) {
            throw e
        }
    }

}

/**
 * Set a route on router
 * @function
 * @param {String} baseRoute Route's base path
 * @param {external:Express#Router} router API router
 * @param {RouteDescription} routeDescription {@link RouteDescription}
 * @returns {void}
 * @private
 */
const setRoute = (baseRoute, router, routeDescription) => {
    const [route, actionDescription] = routeDescription

    if (!route || route[0] !== '/') throw new Error(`Invalid action route! ${route}`)

    try {
        setActions(router.route(baseRoute + route), actionDescription)
    } catch (e) {
        throw e
    }
}

/**
 * Set a route on router
 * @function
 * @param {external:Express#Router} router API router
 * @param {ActionDescription} actionDescription {@link ActionDescription}
 * @returns {void}
 * @private
 */
const setActions = (router, actionDescription) => {
    if (!actionDescription || typeof actionDescription !== 'object') throw new Error(`Invalid action! ${actionDescription}`)
    Object.entries(actionDescription).forEach((action) => {
        try {
            setAction(router, action)
        } catch(e) {
            throw e
        }
    })
}

/**
 * Set a route on router
 * @function
 * @param {external:Express#Router} router API router
 * @param {external:Express#Middleware|Array<external:Express#Middleware>} action
 * @returns {void}
 * @private
 */
const setAction = (router, action) => {
    if (!Array.isArray(action) && action.length === 2) throw new Error('Invalid action! ${action}')
    let [method, callback] = action

    if (!method) throw new Error(`Invalid method!`)
    method = method.trim().toLowerCase()

    if (!router[method]) throw new Error(`Method is not an HTTP verb`)

    if (!callback || !(typeof callback === 'function' || Array.isArray(callback))) throw new Error('Invalid callback to route!')

    router[method](callback)

}

export default Route
