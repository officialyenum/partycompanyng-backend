import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { config } from './config/config';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import * as routes from './routes';
import Logging from './library/Logging';

dotenv.config(); // load .env file

const app = express();

// Setup Mongoose
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        Logging.info('Connected to MongoDB');
        StartServer();
    })
    .catch((err) => {
        Logging.error('Unable to connect to MongoDB');
        Logging.error(err);
    });

const StartServer = () => {
    // Setup express layouts
    app.use(expressLayouts);
    app.set('layout', 'layouts/layout');
    app.set('view engine', 'ejs');

    // Setup static files
    app.set('views', path.join(__dirname, 'views')); // specify the views directory
    app.use(express.static(path.join(__dirname, 'public'))); // specify the static assets directory

    /** Register Routes */
    routes.register(app);

    const PORT = process.env.SERVER_PORT || 3000;

    app.listen(PORT, () => {
        // tslint:disable-next-line:no-console
        console.log(`Server started at http://localhost:${PORT}`);
    });
};
