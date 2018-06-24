/**
 * @module API
 * @author Paulo Ricardo Xavier Giusti
 */

 /**
 * The Express namespace.
 * @external "Express"
 * @see {@link https://github.com/expressjs/express|Express}
 */

import express, { Router } from 'express';
import bodyparser from 'body-parser';

import { Database as database } from './helpers';
import APIError from './lib/APIError';
import routes from './routes';

const app = express();

const port = process.env.PORT || 3000;

const init = async () => {
    global.__baseUrl = __dirname;
    let router;

    try {
        await database.connect();
        APIError.setAPIErrors('error.json');
        router = new Router();
        Object.values(routes).forEach(Route => {
            const newRoute = new Route(router);

            newRoute.init();
        });
    } catch (e) {
        console.error(e);
        return;
    }

    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    app.use(APIError.errorHandler);
    app.use(router);

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

init();
