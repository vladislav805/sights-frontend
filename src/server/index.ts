import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { getUserByAuthKey } from './sessions';
import { IBaseRendererHtmlProps, renderBaseHtml } from './renderers';
import { getOpenGraphByPath, isServiceParserByUserAgent } from './shares';
import * as QueryString from 'querystring';

const index = express();

index.use(cookieParser());
index.use('/static', express.static('dist/static'));

// eslint-disable-next-line
index.all('/*', async(req, res) => {
    const authKey = (req?.cookies as Record<string, string>)?.authKey;
    const userAgent = req.header('user-agent');

    const props: IBaseRendererHtmlProps = {};

    if (isServiceParserByUserAgent(userAgent)) {
        props.openGraph = await getOpenGraphByPath(req.path, req.query as QueryString.ParsedUrlQuery);
    } else {
        props.user = await getUserByAuthKey(authKey);
    }

    res.send(renderBaseHtml(props));
});

index.listen(3802, () => console.info('Server start on port 3802'));
