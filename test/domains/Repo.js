import mocha from 'mocha'
import { expect, assert } from 'chai'

import { Database } from '../../src/helpers'
import APIError from '../../src/lib/APIError'
import GithubAPI from '../../src/lib/GithubAPI'
import { Repo } from '../../src/domains'
import { Repo as RepoModel } from '../../src/database'


describe('Repo domain module', () => {
    before(async function() {
        this.timeout(5000)
        try {
            await Database.connect()
            global.__baseUrl = __dirname
            APIError.setAPIErrors('../../src/error.json')
        } catch (e) {
            throw e
        }
    })

    after(async () => {
        try {
            await Database.disconnect()
        } catch (e) {
            throw e
        }
    })

    describe('Get user repos', () => {
        before(async () => {
            try {
                await RepoModel.create({ name: 'test/test1', starredBy: 'testStar' })
                await RepoModel.create({ name: 'test/test3', starredBy: 'testStar' })
                await RepoModel.create({ name: 'test/test4', starredBy: 'testStar' })

                await RepoModel.create({ name: 'test/test2', starredBy: 'testStar2', lastSearch: new Date(new Date().getDate() - 6) })
            } catch(e) {
                throw e
            }
        })

        after(async () => {
            try {
                await RepoModel.deleteMany({ starredBy: 'testStar' })
                await RepoModel.deleteMany({ starredBy: 'testStar2' })
            } catch(e) {
                throw e
            }

        })

        describe('database strategy', () => {
            it('should not accept empty or other type username', async () => {
                const username1 = ''
                const username2 = { name: 'olavo' }

                try {
                    await Repo.getUserReposFromDB(username1)
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                }

                try {
                    await Repo.getUserReposFromDB(username2)
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                    return
                }


                assert.fail('actual', 'should thrown error', 'accepted invalid parameters')
            })

            it('should return empty array when user was not searched yet', async () => {
                try {
                    const repos = await Repo.getUserReposFromDB('olavo')
                    expect(repos).to.be.an('array')
                    expect(repos.length).to.be.equal(0)
                } catch (e) {
                    assert.fail('actual', 'should thrown error', e.message)
                }
            })

            it('should return empty array if user last search was more then 5 days ago', async () => {
                try {
                    const repos = await Repo.getUserReposFromDB('testStar2')
                    expect(repos).to.be.an('array')
                    expect(repos.length).to.be.equal(0)
                } catch (e) {
                    assert.fail('actual', 'should thrown error', e.message)
                }
            })

            it('should return array of repos correctly', async () => {
                try {
                    const repos = await Repo.getUserReposFromDB('testStar')
                    expect(repos).to.be.an('array')
                    expect(repos.length).to.be.equal(3)
                } catch (e) {
                    assert.fail('actual', 'should thrown error', e.message)
                }
            })
        })

        describe('github strategy', () => {
            it('should not accept empty or other type username', async () => {
                const username1 = ''
                const username2 = { name: 'olavo' }

                try {
                    await Repo.getUserReposFromGithub(username1)
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                }

                try {
                    await Repo.getUserReposFromGithub(username2)
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                    return
                }


                assert.fail('actual', 'should thrown error', 'accepted invalid parameters')
            })

            it('should throw APIError if user is not found', async () => {
                try {
                    const repo = await Repo.getUserReposFromGithub('AKPODkdaajsJdjm')
                } catch (e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                    return
                }

                assert.fail('actual', 'should thrown error', 'it found an user that doesnt exist')
            })

            it('should get user repos and its languages', async () => {
                try {
                    const repos = await Repo.getUserReposFromGithub('prxg22')
                    expect(repos).to.be.an('array')
                    const material = repos.find(repo => repo.name === 'angular/material')
                    expect(material).to.exist
                    expect(material).to.be.an('object')
                    expect(material.name).to.be.equal('angular/material')
                    expect(material.starredBy).to.be.equal('prxg22')
                    expect(material.languages).to.be.an('array').that.include('JavaScript')
                    expect(material.languages.length).to.be.equal(5)
                } catch (e) {
                    assert.fail('actual', 'should thrown error', e.message)
                }
            })
        })

        describe('full strategy', () => {
            it('should not accept empty or other type username', async () => {
                const username1 = ''
                const username2 = { name: 'prxg' }

                try {
                    await Repo.getUserRepos(username1)
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                }

                try {
                    await Repo.getUserRepos(username2)
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.httpCode).to.be.equal(404)
                    return
                }

                assert.fail('actual', 'should thrown error', 'accepted invalid parameters')
            })

            it('should create new repository', async () => {
                try {
                    await RepoModel.deleteMany({ starredBy: 'octocat' })
                    const repos = await Repo.getUserRepos('octocat')
                    repos.forEach(repo => expect(repo._id).to.exist)
                } catch (e) {
                    assert.fail('actual', 'create new repository', e.message)
                }


            }).timeout(3000)
        })
    })

    describe('Find or create repos on DB', () => {
        it('should not accept empty or other type repo data', async () => {
            try {
                const repos = await Repo.findOrCreateRepos()
            } catch (e) {
                expect(e).to.be.an('error')
                expect(e.httpCode).to.be.equal(400)
            }

            try {
                const repos = await Repo.findOrCreateRepos({})
            } catch (e) {
                expect(e).to.be.an('error')
                expect(e.httpCode).to.be.equal(400)
                return
            }

            assert.fail('actual', 'thrown error', 'user was created')
        })

        it('should create or find user starred repos on DB', async () => {
            try {
                const ghRepos = await Repo.getUserReposFromGithub('octocat')
                const repos = await Repo.findOrCreateRepos(ghRepos)

                expect(repos).to.be.an('array')
                expect(repos.length).to.be.equal(3)
                repos.forEach(repo => {
                    expect(repo).to.exist
                    expect(repo.starredBy).to.be.equal('octocat')
                })

                RepoModel.deleteMany({ starredBy: 'octocat' })
            } catch (e) {
                assert.fail('actual', 'create user', e.message)
            }
        })

        it('should keep repos tags', async () => {
            try {
                const ghRepos = await Repo.getUserReposFromGithub('octocat')
                const taggedRepo = await RepoModel.findOne(ghRepos[0])
                taggedRepo.tags = ['cool']
                await taggedRepo.save()

                const repos = await Repo.findOrCreateRepos([ghRepos[0]])

                expect(repos).to.be.an('array')
                expect(repos[0].tags).to.be.an('array').that.contains('cool')
            } catch (e) {
                assert.fail('actual', 'create user', e.message)
            }
        })
    })
})
