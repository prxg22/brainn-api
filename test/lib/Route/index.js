// import libs
import mocha from 'mocha'
import { expect, assert } from 'chai'
import express, { Router } from 'express'

// import Route module
import Route from '../../../src/lib/Route'

// initiate express app and its router
const router = new Router()
const cb = (req, res, next) => { }

describe('Route module', () => {
    class TestRoute extends Route {
        route = '/test'
        actions = {
            '/': { get:  cb },
            '/:id': { get: cb, post: cb, delete: cb },
            '/test2': { get: [cb, cb], post: cb, delete: cb }
        }
    }

    let route = null

    describe('Route creation', () => {
        it('should throw Error if router is not set', () => {
            try {
                route = new TestRoute()
            } catch (e) {
                expect(e).to.be.an('error')
                expect(e.message).to.be.equal('Invalid router')
                return
            }
            assert.fail("actual", "throw 'Invalid router' error", "TestRoute was created ):")
        })

        it('should throw Error if router is not an instance of Express.router', () => {
            try {
                route = new TestRoute({})
            } catch(e) {
                expect(e).to.be.an('error')
                expect(e.message).to.be.equal('Invalid router')
                return
            }
            assert.fail("actual", "throw 'Invalid router' error", "TestRoute was created ):")
        })

        it('should create route successfully', () => {
            try {
                route = new TestRoute(router)
            } catch (e) {
                assert.fail("actual", "be instance of TestRoute", e.message)
                return
            }
            expect(route).to.be.instanceof(TestRoute)
            expect(route).to.be.instanceof(Route)
        })
    })

    describe('Route initialization', () => {
        class OtherTypeRoute extends Route { route = true; actions = { '/action-route': { get: cb } } }
        class OtherTypeActions extends Route { route = '/route'; actions = true }
        class WithoutSlash extends Route { route = 'route'; actions = { '/action-route': { get: cb } } }
        class Empty extends Route { route = ''; actions = { '/action-route': { get: cb } } }
        class EmptyActionRoute extends Route { route = '/route'; actions = { '': { get: cb } } }
        class WithoutSlashActionRoute extends Route { route = '/route'; actions = { 'action-route': { get: cb } } }
        class OtherTypeAction extends Route { route = '/route'; actions = { '/action-route': true } }
        class NoAction extends Route { route = '/route'; actions = { '/action-route': null } }
        class OtherTypeMethod extends Route { route = '/route'; actions = { '/action-route': { get: true } } }
        class EmptyMethod extends Route { route = '/route'; actions = { '/action-route': { '': cb } } }
        class NotHttpMethod extends Route { route = '/route'; actions = { '/action-route': { 'maduro': cb } } }
        class NullMethod extends Route { route = '/route'; actions = { '/action-route': { 'post': null } } }
        class OtherTypeCallback extends Route { route = '/route'; actions = { '/action-route': { 'post': 'blasfemia' } } }

        describe('Initiated with invalid this.route', () => {
            it('should throw errow with other type this.route', () => {
                const otherTypeRoute = new OtherTypeRoute(router)
                try {
                    otherTypeRoute.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid route! ${otherTypeRoute.route}`)
                    return
                }
                assert.fail("actual", "throw 'Invalid route!' error", "TestRoute was initiated")
            })

            it('should throw errow with empty this.route', () => {
                const emptyRoute = new Empty(router)
                try {
                    emptyRoute.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid route! `)
                    return
                }
                assert.fail("actual", "throw 'Invalid route!' error", "TestRoute was initiated")
            })

            it('should throw errow this.route without slash', () => {
                const withoutSlash = new WithoutSlash(router)
                try {
                    withoutSlash.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid route! ${withoutSlash.route}`)
                    return
                }
                assert.fail("actual", "throw 'Invalid route!' error", "TestRoute was initiated")
            })
        })

        describe('Initiated with invalid this.actions', () => {
            it('should throw error when initiated with other type this.actions', () => {
                const otherTypeActions = new OtherTypeActions(router)
                try {
                    otherTypeActions.init()
                } catch (e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid actions! ${otherTypeActions.actions}`)
                    return
                }
                assert.fail("actual", "throw 'Invalid route!' error", "TestRoute was initiated")
            })

            it('should throw error when this.actions.<route> action route path is empty', () => {
                const emptyActionRoute = new EmptyActionRoute(router)
                try {
                    emptyActionRoute.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid action route! ${Object.keys(emptyActionRoute.actions)}`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when this.actions.<route> action route path not begins with slash', () => {
                const withoutSlashActionRoute = new WithoutSlashActionRoute(router)
                try {
                    withoutSlashActionRoute.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid action route! ${Object.keys(withoutSlashActionRoute.actions)}`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when intiated with no this.actions.<route>', () => {
                const noAction = new NoAction(router)
                try {
                    noAction.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid action! null`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when intiated with other type this.actions.<route>', () => {
                const otherTypeAction = new OtherTypeAction(router)
                try {
                    otherTypeAction.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid action! true`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })


            it('should throw error when this.actions.<route>.<method> is empty', () => {
                const emptyMethod = new EmptyMethod(router)
                try {
                    emptyMethod.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid method!`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when this.actions.<route>.<method> isn`t an HTTP verb', () => {
                const notHttpMethod = new NotHttpMethod(router)
                try {
                    notHttpMethod.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Method is not an HTTP verb`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when this.actions.<route>.<method> isn`t an HTTP verb', () => {
                const notHttpMethod = new NotHttpMethod(router)
                try {
                    notHttpMethod.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Method is not an HTTP verb`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when this.actions.<route>.<method> is null', () => {
                const nullMethod = new NullMethod(router)
                try {
                    nullMethod.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid callback to route!`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should throw error when initialized with other type this.actions.<route>.<method>', () => {
                const otherTypeCallback = new OtherTypeCallback(router)
                try {
                    otherTypeCallback.init()
                } catch(e) {
                    expect(e).to.be.an('error')
                    expect(e.message).to.be.equal(`Invalid callback to route!`)
                    return
                }
                assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
            })

            it('should initialize and set router correctly', () => {
                const newRouter = new Router()
                try {
                    new TestRoute(newRouter).init()
                } catch(e) {
                    assert.fail("actual", "throw 'Invalid action route!' error", "TestRoute was initiated")
                    return
                }

                expect(newRouter.stack.length).to.be.equal(3)
                expect(newRouter.stack[0].route.path).to.be.equal('/test/')
                expect(newRouter.stack[1].route.path).to.be.equal('/test/:id')
                expect(newRouter.stack[2].route.path).to.be.equal('/test/test2')
            })
        })
    })
})
