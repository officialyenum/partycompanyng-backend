import * as express from 'express';
import webRoutes from './web';
import apiRoutes from './api';
import Logging from '../library/Logging';

export const register = (app: express.Application) => {
    // Logging middleware
    app.use((req, res, next) => {
        Logging.info(`Incoming -> Method: [${req.method}] - url : [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the response */
            Logging.info(`Outgoing -> Method: [${req.method}] - url : [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    // Setup routes
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    /** Rules of our API */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    // Setup Web routes in 'src/routes/web.ts'
    app.use('/', webRoutes);

    // Setup Api routes in 'src/routes/api.ts'
    app.use('/api', apiRoutes);

    /** Error Handling */
    app.use((req, res, next) => {
        const error = new Error('Not found');
        Logging.error(error);
        return res.status(404).json({
            message: error.message
        });
    });
};
