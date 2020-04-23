import { Request, Response, NextFunction, Handler } from 'express';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.fetch = fetch;

export function proxy(): Handler {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ db: 1111 });
        } catch (err) {
            next(err);
        }
    };
}
