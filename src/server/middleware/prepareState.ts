import { Handler, Request, Response, NextFunction } from 'express';
import { rootReducer } from '../../store';
import { matchUrl } from '../utils/matchUrl';

export function prepareState(): Handler {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const router = matchUrl(req.url);

            if (!router) {
                return res.status(404).end();
            }

            const state = {
                ...rootReducer(undefined, { type: 'INIT' }),
                //...(await getData(router)),
                ...({ data: 'two data' }),
            };

            req.state = {
                files: {},
                css: [],
                js: [],

                state,
            };

            next();
        } catch (err) {
            next(err);
        }
    };
}
