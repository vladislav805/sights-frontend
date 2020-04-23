import { Request, Response, NextFunction, Handler } from 'express';

import { matchUrl } from '../utils/matchUrl';
//import { getData } from '../dataSource';

export function routeApi(): Handler {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const router = matchUrl(req.query.url.toString());

            if (!router) {
                return next(new Error(`Cannot match URL`));
            }

            //res.json(await getData(router));
            res.json({ data: 'load from db' });
        } catch (err) {
            next(err);
        }
    };
}
