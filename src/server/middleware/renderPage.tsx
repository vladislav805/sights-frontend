import * as React from 'react';
import * as express from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../../components/App/@server';

export function renderPage(): express.Handler {
    return (req: express.Request, res: express.Response) => {
        const content = renderToStaticMarkup(<App state={req.state} url={req.url} />);

        res.send('<!DOCTYPE html>' + content).end();
    };
}
