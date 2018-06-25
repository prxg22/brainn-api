import mocha from 'mocha'
import { expect, assert } from 'chai'

import APIError from '../../src/lib/APIError'
import { Repo } from '../../src/domains'

global.__baseUrl = __dirname
APIError.setAPIErrors('../../src/error.json')

describe('Repo domain module', () => {
    describe('Get user repos', () => {
        it('should not accept empty or other type username', async () => {
            const username1 = ''
            const username2 = { name: 'prxg' }

            try {
                await Repo.getUserStarredRepos(username1)
            } catch(e) {
                expect(e).to.be.an('error')
                expect(e.httpCode).to.be.equal(400)
            }

            try {
                await Repo.getUserStarredRepos(username2)
            } catch(e) {
                expect(e).to.be.an('error')
                expect(e.httpCode).to.be.equal(400)
                return
            }

            assert.fail('actual', 'should thrown error', 'accepted invalid parameters')
        })
    })
})
