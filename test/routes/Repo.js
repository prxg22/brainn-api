import express, { Router } from 'express'
import bodyparser from 'body-parser'
import request from 'request-promise-native'
import mocha from 'mocha'
import { expect, assert } from 'chai'

import { Database } from '../../src/helpers'
import { APIError } from '../../src/lib/APIError'
import { Repo } from '../../src/routes'

const app = express()
const config = async () => {
    try {
        await Database.connect()

        // APIError.setAPIErrors('error.json')

        app.use(bodyparser.urlencoded({ extended: true }))
        app.use(bodyparser.json())
        // app.use(APIError.errorHandler)
    } catch (e) {
        throw e
    }
}

describe('Repo route module', () => {
    before(async function() {
        try {
            await config()
            const router = new Router()
            app.use(new Repo(router))
            await app.listen('5851')
        } catch(e) {
            throw e
        }
    })

    describe('Get user repos', () => {
        it('should return 404 to invalid users', async () => {
            try {
                const repos = await request({
                    uri: 'http://localhost:5851/repo/user/dADIOJndjDANJniCAMALsdkALdAWodAiAIDNluwiDNUABD'
                })
            } catch (e) {
                console.log(e)
            }

            assert.fail('actual')
        })
    })


})
