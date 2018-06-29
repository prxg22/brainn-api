/**
 * @module API
 * @author Paulo Ricardo Xavier Giusti
 */

 /**
 * The Express namespace.
 * @external "Express"
 * @see {@link https://github.com/expressjs/express|Express}
 */

import express, { Router } from 'express'
import bodyparser from 'body-parser'

import { Database as database } from './helpers'
import APIError from './lib/APIError'
import GithubAPI from './lib/GithubAPI'
import routes from './routes'

const app = express()

const port = process.env.PORT || 3000


const initRoutes = router => {
    try {
        Object.values(routes).forEach(Route => {
            const newRoute = new Route(router)
            newRoute.init()
        })
    } catch (e) {
        throw e
    }
}

const authenticateGithubAPI = async () => {
    const { GITHUB_USER, GITHUB_TOKEN } = process.env
    if (GITHUB_USER && GITHUB_TOKEN) await GithubAPI.authenticate(GITHUB_USER, GITHUB_TOKEN)
}

const config = async () => {
    try {
        await database.connect()

        APIError.setAPIErrors('error.json')

        await authenticateGithubAPI()

        const router = new Router()
        initRoutes(router)
        router.use(APIError.errorHandler)

        app.use(bodyparser.urlencoded({ extended: true }))
        app.use(bodyparser.json())

        // cors
        app.use((req, res, next) => {
            res.set('Access-Control-Allow-Origin', req.get('origin'))
            res.set('Access-Control-Allow-Credentials', true)
            res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
            res.set('Access-Control-Max-Age', '3600')
            next()
        })

        app.use(router)

    } catch (e) {
        throw e
    }
}

const init = async () => {
    global.__baseUrl = __dirname

    try {
        await config()
        await app.listen(port)
        console.log(`Listening on port ${port}`)
    } catch (e) {
        throw e
    }
}

try {
    init()
} catch (e) {
    throw e
}
