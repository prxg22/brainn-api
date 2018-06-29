/**
 * @module libs/GithubAPI
 * @author Paulo Ricardo Xavier Giusti
 */
import request from 'request-promise-native'

const headers = { 'User-Agent': 'brainnApp' }

/**
 * Main Github API url
 * @type {String}
 * @inner
 */
const url = 'https://api.github.com/'

/**
 * authentication credentials
 * @type {String}
 * @inner
 */
global.auth = global.auth || null

/**
 * Repos URI with replaceable name
 * @type {String}
 * @inner
 */
const reposUrl = 'users/{username}/starred'

/**
 * Languages URI
 * @type {String}
 * @inner
 */
const languagesUrl = 'repos/{repo}/languages'

/**
 * Format url to request Github for user's starred repos within parameters
 * @function
 * @param {String} username Github's username
 * @return {String} Formated url to get user starred repos
 * @alias module:libs/GithubAPI#formatRepoUrl
 * @inner
 */
const formatRepoUrl = username => {
    if (!username) throw new Error('Needs the following parameters: username')
    if (typeof username !== 'string') throw new Error('Username must be a string')
    return (url + reposUrl).replace('{username}', username)
}

/**
 * Format url to request Github for user's repo languages
 * @function
 * @param {String} username Github's username
 * @param {String} repo Github's repo
 * @return {String} Formated url to get repo languages
 * @alias module:libs/GithubAPI#formatLanguageUrl
 * @inner
 */
const formatLanguageUrl = repo => {
    if (!repo) throw new Error('Needs the following parameters: repo')
    if (typeof repo !== 'string') throw new Error('repo must be a string')
    return (url + languagesUrl).replace('{repo}', repo)
}


/**
 * Get user's starred repos
 *
 * @async
 * @function
 * @param {String} username Github's username
 * @return {Github.Repo[]} list of repos
 * @see {@link Github https://developer.github.com/v3}
 * @alias module:libs/GithubAPI#getUserStarredRepos
 */
const getUserStarredRepos = async username => {
    try {
        const uri = formatRepoUrl(username)
        const repos = request({
            headers,
            uri,
        })

        if (global.auth) repos.auth(global.auth.user, global.auth.token)

        return JSON.parse(await repos)
    } catch (e) {
        if (e.statusCode && e.statusCode === 404) throw new Error(`User {${username}} not found!`)
        throw e
    }
}

/**
 * Gets a Github repo's languages
 *
 * @async
 * @function
 * @param {String} username Github's username
 * @param {String} repo Repo name
 * @return {Github.Languages[]} list of languages
 * @see {@link Github https://developer.github.com/v3/}
 * @alias module:libs/GithubAPI#getRepoLanguages
 */
const getRepoLanguages = async repo => {
    try {
        const uri = formatLanguageUrl(repo)

        const languages = request({
            headers,
            uri,
        })
        if (global.auth) languages.auth(global.auth.user, global.auth.token)

        return Object.keys(JSON.parse(await languages))
    } catch (e) {
        if (e.statusCode && e.statusCode === 404) throw new Error(`${repo} not found!`)
        throw e
    }
}


/**
* authenticate on {@link Github API https://developer.github.com/v3/}
*
* @async
* @function
* @param {String} username Github's username
* @param {String} repo Repo name
* @return {Github.Languages[]} list of languages
* @alias module:libs/GithubAPI#authenticate
*/
const authenticate = async (user, token) => {
    const uri = formatRepoUrl('octocat')

    try {
        const repos = await request({
            headers,
            uri
        }).auth(user, token)

        if (repos) global.auth = { user, token }
    } catch (e) {
        throw e
    }

}

export default {
    authenticate,
    formatRepoUrl,
    formatLanguageUrl,
    getUserStarredRepos,
    getRepoLanguages
}
