import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import Logging from '../../library/Logging';
import signJWT from '../../services/signJWT';
import User from '../../models/User';

const NAMESPACE = 'Auth';

class AuthController {
    public static validateToken = async (req: Request, res: Response, next: NextFunction) => {
        Logging.info(`${NAMESPACE} : Token validated, User Authorized`);

        return res.status(200).json({ message: 'Token is valid' });
    };

    public static login = async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;
        User.find({ username })
            .exec()
            .then((users) => {
                if (users.length !== 1) {
                    Logging.error(`${NAMESPACE} : Logged in User Not found in Database`);
                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                }

                Logging.info(`${NAMESPACE} : Logged in : ${users}`);

                bcryptjs.compare(password, users[0].password, (error, result) => {
                    if (error) {
                        Logging.error(`${NAMESPACE} : Password mismatch - ${error.message} : ${error}`);
                        return res.status(401).json({
                            message: 'Unauthorized'
                        });
                    } else if (result) {
                        signJWT(users[0], (_error, token) => {
                            if (_error) {
                                Logging.error(`${NAMESPACE} : Unable to sign token : ${_error}`);
                                return res.status(401).json({
                                    message: 'Unauthorized',
                                    error: _error
                                });
                            } else if (token) {
                                return res.status(201).json({
                                    message: 'Authenticated Successfully',
                                    token,
                                    user: users[0]
                                });
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    };

    public static register = (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;
        bcryptjs.hash(password, 10, (hashError, hash) => {
            if (hashError) {
                return res.status(500).json({
                    message: hashError.message,
                    error: hashError
                });
            }
            const _user = new User({
                _id: new mongoose.Types.ObjectId(),
                username,
                password: hash
            });

            return _user
                .save()
                .then((data) => {
                    signJWT(data, (_error, token) => {
                        if (_error) {
                            Logging.error(`${NAMESPACE} : Unable to sign token : ${_error}`);
                            return res.status(401).json({
                                message: 'Unauthorized',
                                error: _error
                            });
                        } else if (token) {
                            return res.status(201).json({
                                message: 'Registered Successfully',
                                token,
                                user: data
                            });
                        }
                    });
                })
                .catch((error: Error) => {
                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        });
    };
}

export default AuthController;
