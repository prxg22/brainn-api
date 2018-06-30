import GithubAPI from '../lib/GithubAPI'
import APIError from '../lib/APIError'
import { Repo } from '../database'

/**
 * @module domains/Repo
 * @author Paulo Ricardo Xavier Giusti
 */

/**
 * maximum time in days to update repos on DB
 * @type {Number}
 */
const MAX_LAST_SEARCH = 2

/**
 * Get repos on DB
 * @function
 * @async
 * @param {String} username Github username
 * @return {Repo[]} Array of repos
 */
const getUserReposFromDB = async starredBy => {
   if (!starredBy || typeof starredBy !== 'string') throw new APIError('INVALID_USERNAME')

   const cutoff = new Date()
   const lastSearch = { $gt: cutoff.setDate(cutoff.getDate() - MAX_LAST_SEARCH) }

   try {
       const repos = await Repo.find({
           starredBy,
           lastSearch
       }).select('name tags languages _id')

       return repos
   } catch (e) {
       throw new APIError('REPOS_NOT_FOUND')
   }

}

/**
 * Get repos on Github
 * @function
 * @async
 * @param {String} username Github username
 * @return {GHRepo[]} Array of repos
 */
const getUserReposFromGithub = async username => {
   if (!username || typeof username !== 'string') throw new APIError('INVALID_USERNAME')

   try {
       const ghRepos = await GithubAPI.getUserStarredRepos(username)
       const repos = await Promise.all(ghRepos.map(async repo => {
           const languages = await GithubAPI.getRepoLanguages(repo.full_name)
           return {
               name: repo.full_name,
               starredBy: username,
               languages,
           }
       }))

       return repos

   } catch (e) {
       if (e.message === `User {${username}} not found!`) throw new APIError('INVALID_USERNAME')
       throw new APIError('REPOS_NOT_FOUND')
   }
}

/**
 * receives an array of repos and find or create it's model
 * @function
 * @async
 * @param {String} reposDesc Repo data to be found or created on DB
 * @return {Repo[]} Array of repos
 */
const findOrCreateRepos = async repos => {
    if (!repos || !Array.isArray(repos)) throw new APIError('INVALID_REPO_DESCRIPTION')

    try {
        const reposModels = await Promise.all(repos.map(async data => {
            try {
                const repo = await Repo.findOrCreate(data)
                return repo
            } catch (e) {
                throw new APIError('SYS_ERROR')
            }
        }))

        return reposModels
    } catch (e) {
        throw e
    }
}

 /**
  * Try to get repos on DB and return it. If user was not searched or the last search
  * happened too long, get repos from Github
  * @function
  * @async
  * @param {String} username Github username
  * @return {Repo[]} Array of repos
  */
const getUserRepos = async username => {
    if (!username || typeof username !== 'string') throw new APIError('INVALID_USERNAME')

    let repos
    try {
        repos = await getUserReposFromDB(username)
        if (repos.length > 0) return repos
    } catch (e) {
        throw e
    }

    try {
        const ghRepos = await getUserReposFromGithub(username)
        if (ghRepos.lenght < 1) throw new APIError('REPOS_NOT_FOUND')
        repos = await findOrCreateRepos(ghRepos)
    } catch (e) {
        throw e
    }
    return repos
}

/**
 * Updates repo tags
 * @function
 * @async
 * @param {String} _id Repo _id
 * @param {String[]} tags Tags to be included on Repo
 * @return {Repo} repo updated
 */
const updateTags = async (_id, tags) => {
    if (!_id || typeof _id !== 'string') throw new APIError('INVALID_REPO_ID')
    if (!tags || !Array.isArray(tags)) throw new APIError('INVALID_TAGS')

    try {
        let repo = await Repo.findOne({ _id })
        if (!repo || repo.length < 1) throw new APIError('REPO_NOT_FOUND')

        repo.tags = tags

        repo = await repo.save()
        return repo
    } catch (e) {
        throw e
    }

}

/**
 * Get repo's on DB with filter
 * @function
 * @async
 * @param filter Repo _id
 * @param {String[]} filter.tags Tags to be searched
 * @return {Repo} repo updated
 */
const get = async ({ tags, starredBy }) => {
    const query = {}
    let parsedTags
    if (tags) parsedTags = JSON.parse(tags)

    if (parsedTags) query.tags = { $all: parsedTags }

    if (starredBy && typeof starredBy === 'string') query.starredBy = starredBy

    try {
        const repos = await Repo.find(query).select('name tags languages _id')
        if (!repos || repos.length < 1) throw new APIError('REPO_NOT_FOUND')

        return repos
    } catch (e) {
        throw e
    }
}

export default {
    get,
    getUserRepos,
    getUserReposFromDB,
    getUserReposFromGithub,
    findOrCreateRepos,
    updateTags,
}
