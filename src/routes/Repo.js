/**
 * @module routes/Repo
 * @author Paulo Ricardo Xavier Giusti
 */

import { Repo as RepoDomain } from '../domains'
import APIError from '../lib/APIError'
import Route from '../lib/Route'

/**
* Repo route
* @class
* @alias module:routes/Repo
*/
class Repo extends Route {
    route = '/repo'
    actions = {
        '/': { get: search },
        '/user/:username': { get: getUserRepos },
        '/:_id/tags': { post: updateRepoTags },
    }
}

/**
 * Get repo route `(POST repo/user/:username)`
 * @function
 * @param {express.Request} req
 *      @param req.param.username Express http request
 * @param {express.Response} res
 * @param {express.Next} next
 * @return {void}
 * @inner
 */
const getUserRepos = async (req, res, next) => {
    const { params } = req

    try {
        if (!params || !params.username) throw new APIError('INVALID_USERNAME')

        const repos = await RepoDomain.getUserRepos(params.username)

        return res.send(repos)
    } catch (e) {
        return next(e)
    }
}


/**
 * Update repo tag route (POST repo/:_id/tags)
 * @function
 * @param {express.Request} req Express http request
 *      @param req.params._id repo _id
 *      @param req.body.tags array of tags label
 * @param {express.Response} res Express http response
 * @param {express.Next} next Express next function
 * @return {void}
 * @inner
 */
const updateRepoTags = async (req, res, next) => {
    const { params, body } = req
    try {
        if (!params || !params._id) throw new APIError('INVALID_REPO_ID')
        if (!body || !body.tags) throw new APIError('INVALID_TAGS')

        const repo = await RepoDomain.updateTags(params._id, body.tags)

        return res.send(repo)
    } catch (e) {
        return next(e)
    }
}

/**
 * Update repo tag route (GET repo/?q)
 * @function
 * @param {express.Request} req Express http request
 *      @param req.query the query object can be any of the repo model params
 * @param {express.Response} res Express http response
 * @param {express.Next} next Express next function
 * @return {void}
 * @inner
 */
const search = async (req, res, next) => {
    const { query } = req
    try {
        const repo = await RepoDomain.get(query)

        return res.send(repo)
    } catch (e) {
        return next(e)
    }
}

export default Repo
