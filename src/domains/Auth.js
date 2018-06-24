import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import APIError from '../lib/APIError';

/**
 * JWT secret word to generate tokens
 * @type {string}
 */
const jwtSecret = process.env.JWT_SECRET || 'kitty-cat';

/**
 * Expiration time to tokens
 * @type {number}
 */
const expiration = 86400; // 24h

/**
 * Bcrypt salt rounds for password and tokens generation
 * @type {number}
 */
const saltRounds = 12;

/**
 * Min password length
 * @type {number}
 */
const passwordLength = 8;

/**
 * Hash password
 * @function
 * @param {string} password Password to be hashed
 * @returns {string} hashed password
 * @throws {APIError} If no passowrd is given
 * @expose
 */
const hashPassword = password => {
    try {
        // Validate password
        if (!password || password.length < passwordLength) throw new APIError('CREDENTIALS_NOT_VALID');
        let hash;
        // Hash password with bcryptjs

        hash = bcrypt.hash(password, saltRounds);
        return hash;
    } catch (e) {
        throw e;
    }
};

/**
 * Returns true/false if password is equal the hashed.
 * @function
 * @param {string} password Password to be checked
 * @param {string} hashed Hasehd password
 * @returns {boolean}
 * @expose
 */
const comparePassword = async (password, hashed) => {
    if (!password || !hashed) return false;

    try {
        return await bcrypt.compare(password, hashed);
    } catch (e) {
        throw e;
    }
};

/**
 * Generates JWT token from obj
 * @function
 * @param {string} obj Object to be transported
 * @returns {string} JWT token
 * @expose
 */
const authenticate = obj => {
    if (!obj) return null;

    const token = jwt.sign({ obj }, jwtSecret, { expiresIn: expiration });

    return token;
};

/**
 * Checks if token is valid and returns stored object
 * @function
 * @param {string} password Password to be checked
 * @param {string} hashed Hasehd password
 * @returns {boolean|Object}
 * @expose
 */
const authorize = token => {
    if (!token) return false;
    return jwt.verify(token, jwtSecret);
};

/**
 * Checks if token is valid and returns stored object
 * @function
 * @param {express.Request} req Express http request
 * @param {express.Response} res Express http response
 * @param {express.Next} next Express next function
 * @return {void}
 * @expose
 */
const authorizeMiddleware = (req, res, next) => {
    const token = req.headers['x-taquibras-token'];

    try {
        const user = authorize(token);

        if (!token || !user) return res.sendStatus(401);

        req.user = user;

        next();
    } catch (e) {
        return res.sendStatus(401);
    }

};

export default {
    comparePassword,
    hashPassword,
    authenticate,
    authorize,
    authorizeMiddleware
};
