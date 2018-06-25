/**
 * @module libs/GithubAPI
 * @author Paulo Ricardo Xavier Giusti
 */
import request from 'request-promise-native';

const headers = { 'User-Agent': 'brainnApp' };

/**
 * Main Github API url
 * @type {String}
 * @inner
 */
const url = 'https://api.github.com/';

/**
 * Repos URI with replaceable name
 * @type {String}
 * @inner
 */
const reposUrl = 'users/{username}/starred';

/**
 * Languages URI
 * @type {String}
 * @inner
 */
const languagesUrl = 'repos/{username}/{repo}/languages';


/**
 * Format url to request Github for user's starred repos within parameters
 * @function
 * @param {String} username Github's username
 * @return {String} Formated url to get user starred repos
 * @inner
 */
const formatRepoUrl = username => {
    if (!username) throw new Error('Needs the following parameters: username');
    if (typeof username !== 'string') throw new Error('Username must be a string');
    return (url + reposUrl).replace('{username}', username);
};

/**
 * Format url to request Github for user's repo languages
 * @function
 * @param {String} username Github's username
 * @param {String} repo Github's repo
 * @return {String} Formated url to get repo languages
 * @inner
 */
const formatLanguageUrl = (username, repo) => {
    if (!username || !repo) throw new Error('Needs the following parameters: username and repo');
    if (typeof username !== 'string' || typeof repo !== 'string') throw new Error('username and repo must be a string');
    return (url + languagesUrl).replace('{username}', username).replace('{repo}', repo);
};


/**
 * Get user's starred repos
 *
 * @async
 * @function
 * @param {String} username Github's username
 * @return {Github.Repo[]} list of repos
 * @see {@link Github https://developer.github.com/v3}
 * @inner
 */
const getUserStarredRepos = async username => {
    try {
        const uri = formatRepoUrl(username);
        const repos = await request({
            headers,
            uri,
            toJSON: true
        });

        return JSON.parse(repos);
    } catch (e) {
        if (e.statusCode && e.statusCode === 404) throw new Error(`User {${username}} not found!`);
        throw e;
    }
};

/**
 * Gets a Github repo's languages
 *
 * @async
 * @function
 * @param {String} username Github's username
 * @param {String} repo Repo name
 * @return {Github.Languages[]} list of languages
 * @see {@link Github https://developer.github.com/v3/}
 * @inner
 */
const getRepoLanguages = async (username, repo) => {
    try {
        const uri = formatLanguageUrl(username, repo);

        const languages = await request({
            headers,
            uri,
            toJSON: true
        });

        return Object.keys(JSON.parse(languages));
    } catch (e) {
        if (e.statusCode && e.statusCode === 404) throw new Error(`User {${username}} not found!`);
        throw e;
    }
};


export default {
    formatRepoUrl,
    formatLanguageUrl,
    getUserStarredRepos,
    getRepoLanguages
};
