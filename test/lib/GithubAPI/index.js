// // import libs
// import mocha from 'mocha'
// import { expect, assert } from 'chai'
// import express, { Router } from 'express'
//
// // import Route module
// import GithubAPI from '../../../src/lib/GithubAPI'
//
//
// describe('GithubAPI Module', () => {
//   describe('Format repos URL', () => {
//     it('should not accept empty username', () => {
//       try {
//         const url = GithubAPI.formatRepoUrl()
//       } catch(e) {
//         expect(e).to.be.an('error')
//         expect(e.message).to.be.equal('Needs the following parameters: username')
//         return
//       }
//
//       assert.fail("actual", "throw error", "url has an value")
//     })
//
//     it('should not accept username of other type', () => {
//       try {
//         const url = GithubAPI.formatRepoUrl({})
//       } catch(e) {
//         expect(e).to.be.an('error')
//         expect(e.message).to.be.equal('Username must be a string')
//         return
//       }
//
//       assert.fail("actual", "throw error", "url has an value")
//     })
//
//     it('should format url correctly', () => {
//       try {
//         const url = GithubAPI.formatRepoUrl('user')
//         expect(url).to.be.equal('https://api.github.com/users/user/starred')
//       } catch(e) {
//         assert.fail("actual", "format url", "thrown error")
//       }
//     })
//   })
//
//   describe('Format languages URL', () => {
//     it('should not accept empty username or empty repo', () => {
//       try {
//         const url = GithubAPI.formatLanguageUrl('')
//       } catch(e) {
//         expect(e).to.be.an('error')
//         expect(e.message).to.be.equal('Needs the following parameters: username and repo')
//         return
//       }
//
//       try {
//         const url = GithubAPI.formatLanguageUrl('user', '')
//       } catch(e) {
//         expect(e).to.be.an('error')
//         expect(e.message).to.be.equal('Needs the following parameters: username and repo')
//         return
//       }
//
//       assert.fail("actual", "throw error", "url has an value")
//     })
//
//     it('should not accept username of other type', () => {
//       try {
//         const url = GithubAPI.formatLanguageUrl({}, 'repo')
//       } catch(e) {
//         expect(e).to.be.an('error')
//         expect(e.message).to.be.equal('username and repo must be a string')
//         return
//       }
//
//       assert.fail("actual", "throw error", "url has an value")
//     })
//
//     it('should not accept repo of other type', () => {
//       try {
//         const url = GithubAPI.formatLanguageUrl('user', ['a', 'b'])
//       } catch(e) {
//         expect(e).to.be.an('error')
//         expect(e.message).to.be.equal('username and repo must be a string')
//         return
//       }
//
//       assert.fail("actual", "throw error", "url has an value")
//     })
//
//     it('should format url correctly', () => {
//       try {
//         const url = GithubAPI.formatLanguageUrl('user', 'repo')
//         expect(url).to.be.equal('https://api.github.com/repos/user/repo/languages')
//       } catch(e) {
//         assert.fail("actual", "format url", "thrown error")
//         return
//       }
//     })
//   })
//
//   describe('Get Github user repos', () => {
//     it('should not accept empty username', async () => {
//       try {
//         const repos = await GithubAPI.getUserStarredRepos()
//       } catch (e) {
//         expect(e).to.be.an('error')
//         return
//       }
//       assert.fail("actual", 'Get user repos', 'something got wrong!')
//     })
//
//     it('should throw error if user does not exist', async () => {
//       try {
//           const repos = await GithubAPI.getUserStarredRepos('jdopawp')
//       } catch (e) {
//           expect(e).to.be.an('error')
//           expect(e.message).to.be.equal('User {jdopawp} not found!')
//           return
//       }
//       assert.fail("actual", 'Get user repos', 'something got wrong!')
//     })
//
//     it('should get the user repositories correctly', async () => {
//       try {
//           const repos = await GithubAPI.getUserStarredRepos('prxg22')
//           const index = repos.findIndex(r => r.full_name === 'angular/material')
//           expect(repos).to.be.an('array')
//           expect(index).to.be.above(-1)
//       } catch (e) {
//           assert.fail("actual", 'Get user repos', e.message)
//       }
//     })
//   })
//
//   describe('get repo languages', () => {
//       it('should not accept empty repos or username', async () => {
//           try {
//               const languages1 = await GithubAPI.getRepoLanguages(null, 'djiawjoid')
//               const languages2 = await GithubAPI.getRepoLanguages('aijwoeij', )
//           } catch (e) {
//               expect(e).to.be.an('error')
//               return
//           }
//
//           assert.fail("actual", 'Not accept empty paramaters', 'it accepted empty parameters')
//       })
//
//       it('should get repos languages right', async () => {
//           try {
//               const languages = await GithubAPI.getRepoLanguages('angular', 'material')
//               expect(languages).to.be.an('array')
//               const language = languages.indexOf('JavaScript')
//               expect(language).to.be.above(-1)
//           } catch (e) {
//               assert.fail("actual", 'find repo languages right', e.message)
//           }
//       })
//   })
// })
