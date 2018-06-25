import GithubAPI from '../lib/GithubAPI'
import APIError from '../lib/APIError'
import { Repo } from '../database'
/**
 * @module domains/Repo
 * @author Paulo Ricardo Xavier Giusti
 */

const getUserStarredRepos = async username => {
    if (!username || typeof username !== 'string') throw new APIError('INVALID_USERNAME')

    try {
        const repos = GithubAPI.getUserStarredRepos(username)
        repos.map(async GHRepo => {
            const [ user, name ] = GHRepo.fullname.split('/')
            const languages = GithubAPI.getRepoLanguages(user, name)

            const repo = await new Repo.create({
                name: GHRepo.fullname,
                starredBy: username,
                languages,
            })


            return repo
        })
    } catch (e) {
        throw e
    }
}

export default { getUserStarredRepos }
