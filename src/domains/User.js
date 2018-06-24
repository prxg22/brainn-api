import { User } from '../database';
import { Auth } from '../domains';
import APIError from '../lib/APIError';

/**
 * Creates user and return it
 * @function
 * @param {Object} data
 * @return {UserModel}
 * @throws {APIError} if username has already been used
 * @expose
 */
const register = async data => {
    const { username, password } = data;

    let user = null;

    // Hash password
    try {
        const hashedPassword = await Auth.hashPassword(password);

        // Search repeated username
        const repeated = await User.findByUsername(username);

        if (repeated) throw new APIError('DUPLICATED_USER');

        // Salvar novo usario no banco
        user = await User.create({
            username,
            password: hashedPassword
        });

    } catch (e) {
        throw e;
    }

    return user;
};

/**
 * Authenticates user and returns JWT token which should be
 * transported in future requests
 * @function
 * @param {Object} data
 * @return {UserModel}
 * @throws {APIError} if username has already been used
 * @expose
 */
const authenticate = async data => {
    const { username, password } = data;

    try {
        if (!username || !password) throw new APIError('CREDENTIALS_NOT_VALID');

        const user = await User.findByUsername(username);

        if (!user) throw new APIError('CREDENTIALS_NOT_VALID');
        if (!Auth.comparePassword(password, user.password)) throw new APIError('CREDENTIALS_NOT_VALID');

        return Auth.authenticate(user);
    } catch (e) {
        throw e;
    }
};

export default {
    register,
    authenticate
};
