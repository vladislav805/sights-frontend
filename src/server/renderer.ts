import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as path from 'path';
import * as fs from 'fs';
import App from '../components/App';
import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
    // point to the html file created by CRA's build tool
    const filePath = '/home/vlad805/www/sights-react/dist/index.html'; // path.resolve('index.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end()
        }

        // render the app as a string
        const html = ReactDOMServer.renderToString(React.createElement(App));

        // inject the rendered app into our html and send it
        return res.send(
            htmlData.replace(
                '<div id="root"></div>',
                `<div id="root">${html}</div>`
            )
        );
    });
}
