import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as QueryString from 'querystring';
import { getUserByAuthKey } from './sessions';
import { IBaseRendererHtmlProps, renderBaseHtml } from './renderers';
import { getOpenGraphByPath, isServiceParserByUserAgent } from './shares';
import { apiRequestRpc } from './api-rpc';

const index = express();

index.use(cookieParser());
index.use('/static', express.static('dist/static'));

// eslint-disable-next-line
index.all('/*', async(req, res) => {
    const authKey = (req?.cookies as Record<string, string>)?.authKey;
    const userAgent = String(req.header('user-agent'));

    if (req.path.startsWith('/docs/')) {
        res.sendStatus(404).send('Not found');
        res.end();
        return;
    }

    const props: IBaseRendererHtmlProps = {};

    if (!isServiceParserByUserAgent(userAgent) && authKey) {
        props.user = await getUserByAuthKey(authKey);

        // noinspection ES6MissingAwait
        apiRequestRpc<unknown>('account.setOnline', { authKey });
    }

    props.openGraph = await getOpenGraphByPath(req.path, req.query as QueryString.ParsedUrlQuery);

    res.send(renderBaseHtml(props));
});

index.listen(3802, () => console.info('Server start on port 3802'));
